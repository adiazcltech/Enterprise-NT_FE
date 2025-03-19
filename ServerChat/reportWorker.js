import { parentPort, workerData } from 'worker_threads';
import Stimulsoft from 'stimulsoft-reports-js';
import { Transform } from 'stream';

try {
    const { reqBody, path, licenseKey } = workerData;
    console.log('Worker data:');
    // Verificar si el cuerpo de la solicitud es demasiado grande
    if (reqBody.length > 100 * 1024 * 1024) { // Límite de 100 MB
        throw new Error("Request body is too large");
    }

    // Parsear el cuerpo de la solicitud
    const parameterReport = JSON.parse(reqBody);

    // Configurar la licencia de Stimulsoft
    Stimulsoft.Base.StiLicense.key = licenseKey;

    // Cargar la fuente especificada
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(`${path}${parameterReport.letter}`);

    // Cargar el informe
    const report = new Stimulsoft.Report.StiReport();
    report.loadFile(`${path}${parameterReport.pathreport}`);

    // Crear un stream para procesar los datos en lotes
    const jsonStream = new Transform({
        transform(chunk, encoding, callback) {
            try {
                // Procesar cada chunk de datos
                const data = JSON.parse(chunk.toString());
                const dataSet = new Stimulsoft.System.Data.DataSet();
                dataSet.readJson(data);

                // Limpiar bases de datos existentes y registrar los nuevos datos
                report.dictionary.databases.clear();
                report.regData('Demo', 'Demo', dataSet);

                callback();
            } catch (error) {
                callback(error);
            }
        }
    });

    // Enviar los datos al stream
    jsonStream.write(JSON.stringify({
        'data': [parameterReport.datareport],
        'Labels': [parameterReport.labelsreport],
        'Variables': [parameterReport.variables]
    }));
    jsonStream.end();


    // Determinar el formato de exportación
    const format = parameterReport.type === 'pdf' 
        ? Stimulsoft.Report.StiExportFormat.Pdf 
        : Stimulsoft.Report.StiExportFormat.Excel2007;

    // Renderizar y exportar el informe de manera asíncrona
    report.renderAsync(() => {
        report.exportDocumentAsync((data) => {
            // Convertir los datos a un buffer y enviar la respuesta
            console.log('Data:', data);
            //const buffer = Buffer.from(data);
            parentPort.postMessage({ data: {'type':'Buffer','data':data} });
        }, format);
    });
} catch (error) {
    parentPort.postMessage({ error: error.message });
}