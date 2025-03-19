'use strict';

import HttpDispatcher from 'httpdispatcher';
import merge from 'easy-pdf-merge';
import { mkdirSync, writeFileSync, unlinkSync, existsSync, rmdirSync, readFileSync, writeFile, readFile } from 'fs';
import pdf2base64 from 'pdf-to-base64';
import pkglodash from 'lodash';
import dotenv from "dotenv";
import { create } from "pdf-creator-node";
import { parse as json2csv } from 'json2csv';
import pkghandlebars from 'handlebars';
import http from 'http';
import socketIO from 'socket.io';
import socket from './socket.js';
import Stimulsoft from 'stimulsoft-reports-js';

dotenv.config();

// Setup basic dispatcher
const dispatcher = new HttpDispatcher();
dispatcher.setStatic('.');
dispatcher.setStaticDirname('.');

// Handlebars helpers
const registerHelpers = () => {
    pkghandlebars.registerHelper('if', (conditional, options) => conditional ? options.fn(this) : options.inverse(this));
    pkghandlebars.registerHelper('gt', (a, b) => a > b);
    pkghandlebars.registerHelper('arrayLength', array => array.length);
};

registerHelpers();

// Centralized error handling for requests
const sendError = (res, message, statusCode = 500) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
};

// Handle cross-origin headers
const handleCors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return true;
    }
    return false;
};

// Server setup and handling
const handleRequest = (req, res) => {
    if (handleCors(req, res)) return;
    try {
        dispatcher.dispatch(req, res);
    } catch (e) {
        console.error(e);
        sendError(res, "Error in dispatching request.");
    }
};

const server = http.createServer(handleRequest);
const io = socketIO(server);

io.sockets.on('connection', socket);

// Helper to process different test states
const processTestState = (data, state) => pkglodash.chain(data)
    .map(item => ({ ...item, tests: pkglodash.filter(item.tests, test => test.result.state === state) }))
    .filter(item => item.tests.length > 0)
    .value();

// Refactored report rendering
dispatcher.onPost("/api/renderReport", async (req, res) => {
    try {
        const parameterReport = JSON.parse(req.body);
        const path = process.env.PATH_LIS;
        
        Stimulsoft.Base.StiLicense.key = process.env.STIMULSOFT_LICENSE;
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(`${path}${parameterReport.letter}`);

        const report = new Stimulsoft.Report.StiReport();
        report.loadFile(`${path}${parameterReport.pathreport}`);

        const jsonData = {
            'data': [parameterReport.datareport],
            'Labels': [parameterReport.labelsreport],
            'Variables': [parameterReport.variables]
        };
        const dataSet = new Stimulsoft.System.Data.DataSet();
        dataSet.readJson(jsonData);

        report.dictionary.databases.clear();
        report.regData('Demo', 'Demo', dataSet);
        report.render();

        const format = parameterReport.type === 'pdf' ? Stimulsoft.Report.StiExportFormat.Pdf : Stimulsoft.Report.StiExportFormat.Excel2007;
        
        report.renderAsync(() => {
            report.exportDocumentAsync((data) => {
                const buffer = Buffer.from(data, "utf-8");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(buffer));
            }, format);
        });
    } catch (error) {
        console.error(error);
        sendError(res, "Error rendering report");
    }
});

// Refactored PDF merging function
dispatcher.onPost("/api/mergepdf", async (req, res) => {
    try {
        const attachments = JSON.parse(req.body);
        if (attachments.length === 0) return sendError(res, "No attachments provided", 204);

        const current = Date.now();
        const pathinit = `./attachments/${current}`;
        mkdirSync(pathinit);

        const names = attachments.map((attach, index) => {
            const buffer = Buffer.from(attach.file, 'base64');
            const filePath = `${pathinit}/${attach.idOrder}${index}.pdf`;
            writeFileSync(filePath, buffer, 'base64');
            return filePath;
        });

        if (attachments.length === 1) names.push("./attachments/empty.pdf");

        const finalPath = `${pathinit}/${attachments[0].idOrder}final.pdf`;
        merge(names, finalPath, async (err) => {
            if (err) return sendError(res, "Error merging PDFs");

            const response = await pdf2base64(finalPath);
            names.forEach(name => name !== './attachments/empty.pdf' && unlinkSync(name));
            unlinkSync(finalPath);
            rmdirSync(pathinit, { recursive: true });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        });
    } catch (error) {
        console.error("PDF merge error:", error);
        sendError(res, "Error processing request");
    }
});

// Refactored PDF generation function
dispatcher.onPost("/api/generarpdf", async (req, res) => {
    try {
        const data = JSON.parse(req.body);
        const current = Date.now();
        const pathinit = `./list/${current}`;
        mkdirSync(pathinit);

        if (data.template === "reviewofresult/billing") {
            data.data = {
                Ingresados: processTestState(data.data, 0),
                Repetición: processTestState(data.data, 1),
                Resultado: processTestState(data.data, 2),
                "Pre Validados": processTestState(data.data, 3),
                Validados: processTestState(data.data, 4),
                Impresos: processTestState(data.data, 5),
            };
        }

        if (data.type === "pdf") {
            const finalPath = `${pathinit}/final.pdf`;

            const document = {
                html: readFileSync(`templateReports/${data.template}.html`, "utf8"),
                data: { variables: data.variables, orders: data.data },
                path: finalPath,
                type: ""
            };

            const options = {
                height: "17.0in",
                width: "22.0in",
                border: "10mm",
                timeout: '1000000',
                footer: {
                    height: "10mm",
                    contents: { default: '<span style="font-style:normal;font-weight:bold;font-size:7pt;font-family:Arial;text-align:center; color: #444;">Pagina {{page}} de {{pages}}</span>' }
                }
            };

            await create(document, options);
            const response = await pdf2base64(finalPath);
            unlinkSync(finalPath);
            rmdirSync(pathinit, { recursive: true });
            res.end(JSON.stringify(response));
        } else{
            var final = `${pathinit}/final.csv`;
            const orders = data.data
            console.log(orders.length)
            //const fields = [];
                
            //const csv = json2csv(orders, { fields });
            //const csv = json2csv({ data: orders, fields: fields, excelStrings:true, withBOM: true}); 
            const templateSource = readFileSync("templateReports/" + data.template + ".hbs", 'utf8')
            const template = pkghandlebars.compile(templateSource);
        
            const output = template({ orders });
            console.log(output)
    
            writeFile(final, output, { encoding: 'utf-8' } , function(err) {
              if (err) throw err;
                        
              readFile(final, function(err, data) {
                    if (err) throw err;
                    unlinkSync(final);
                    rmdirSync(pathinit, {recursive: true})
                    
                    // Crear un objeto Buffer a partir del contenido del archivo
                    const buffer = Buffer.from(data, 'utf8');
    
                  // Convertir el objeto Buffer a una cadena base64
                  const base64 = buffer.toString('base64');
                  
                  res.end(JSON.stringify(base64));
                });
              
            });
            
            
            
        }
    } catch (error) {
        console.error("PDF generation error:", error);
        sendError(res, "Error generating PDF");
    }
});

// Start server
const PORT = process.env.PORT || 10004;
server.listen(PORT, () => {
    console.log(`>> Server running on port ${PORT}`);
});
