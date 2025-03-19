
import express from 'express';
import cors from "cors";
//import * as https from 'https'; // para https
//import * as fs from 'fs'; // para https
//import * as util from 'util'; // para https
import cron from 'node-cron';

import resolutionRoutes from "../routes/route.resolution";
import statisticsRoutes from "../routes/route.statistics";
import resultscheckingRoutes from "../routes/route.resultschecking";
import demographicsRoutes from "../routes/route.demographics";
import cubeRoutes from "../routes/route.statisticalcube";
import emailRoutes from "../routes/tools/route.email";
import securityRoutes from "../routes/route.security";
import documentsRoutes from "../routes/route.documents";
import { db,  dbDoc,  dbStat } from '../db/config/conection';
import { docsmodels } from '../entities/docsdb';
import { mainmodels } from '../entities/maindb';
import { migratePatients } from '../tools/schedulemigration';
import { sendDataDashboard } from '../db/dashboard';
//import { docsmodels } from '../entities/docsdb';

//constante para leer archivos con promesas para https
//const readFile = util.promisify(fs.readFile);

class Server {

    private app; 
    private port: number ;
    private apiPaths = {
        resolution:             '/api/resolution',
        statistics:             '/api/statistics',
        resultschecking:        '/api/resultschecking',
        demographics:           '/api/demographics',
        cube:                   '/api/cube',
        email:                  '/api/email',
        security:               '/api/security',
        documents:              '/api/documents'
    }

    constructor() {
        this.app = express();
        this.port = Number( process.env.PORT ) || 5200;// se recomienda cambiar en el .env

        // initialize conect to db , dbStat and others services
        this.initialize();

        //Middlewares;
        this.middlewares();

        //Rutas
        this.routes();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );
        this.app.use(express.json({limit: '50mb'}));
    }

    routes() {
        this.app.use( this.apiPaths.resolution, resolutionRoutes );
        this.app.use( this.apiPaths.statistics, statisticsRoutes );
        this.app.use( this.apiPaths.resultschecking, resultscheckingRoutes );
        this.app.use( this.apiPaths.demographics, demographicsRoutes );
        this.app.use( this.apiPaths.cube, cubeRoutes );
        this.app.use( this.apiPaths.email, emailRoutes );
        this.app.use( this.apiPaths.security, securityRoutes );
        this.app.use( this.apiPaths.documents, documentsRoutes)

    }

    async initialize() {
        try {
            await this.dbConnection();
            await this.dbConnectionStat();
            await this.dbConnectionDoc();
            // other services
            this.migrationSchedule();
        } catch (error) {
            console.error("Error initializing server: ", error);
        }
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Conexión exitosa con la base de datos');
            mainmodels;
        } catch(error) {
            console.log('Problemas de conexión con la base de datos', error);
        }
    }

    async dbConnectionStat() {
        try {
            await dbStat.authenticate();
            console.log('Conexión exitosa con la base de datos de estadisticas');
        } catch(error) {
            console.log('Problemas de conexión con la base de datos de estadisticas', error);
        }
    }

     async dbConnectionDoc() {
        try {
            await dbDoc.authenticate();
            console.log('Conexión exitosa con la base de datos de documentos');
            docsmodels;
        } catch(error) {
            console.log('Problemas de conexión con la base de datos de documentos', error);
        }
    }
    async listen() {
        /*Con certificado*/
        // const [key, cert] = await Promise.all([
        //     readFile('./certificado/lab.laboratorioadl.com-key.pem'),
        //     readFile('./certificado/lab.laboratorioadl.com-cert.pem')
        // ]);

        // https.createServer({ key, cert }, this.app).listen(this.port, () => {
        //     console.log('Servidor corriendo en puerto', this.port );
        // });

        /*Sin certificado*/
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
 
    }


    async migrationSchedule() {
        cron.schedule('* * * * *', () => {
            console.log(`Ejecución envio a tableros : `);
            sendDataDashboard()
        });
    }
    
}

export default Server;
