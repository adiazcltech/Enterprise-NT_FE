import cron from "node-cron";
import { dbEnterprise, dbStat } from "../db/connection";
import { renameNT, renameStat, TableNextYearNT,  TableNextYearStat,  updateKeys } from "../db/rename";

class Server {
    constructor() {}

    async validateConnections() {
        try {
            await dbEnterprise.authenticate();
            console.log('Conexión exitosa a la base de datos de Enterprise NT');
        } catch (error: any) {
            console.log('Conexión fallida a la base de datos de Enterprise NT');
            throw new Error(error);
        }

        try {
            await dbStat.authenticate();
            console.log('Conexión exitosa a la base de datos de Estadísticas');
        } catch (error: any) {
            console.log('Conexión fallida a la base de datos de Estadísticas');
            throw new Error(error);
        }
    }

    async dbConnectionNT(): Promise<void> {
        try {
            await renameNT();
            await updateKeys();
            await TableNextYearNT();
        } catch (error: any) {
            console.error('Error en dbConnectionNT:', error);
            throw new Error(error);
        }
    }

    async dbConnectionStat(): Promise<void> {
        try {
            await renameStat();
            await TableNextYearStat();
        } catch (error: any) {
            console.error('Error en dbConnectionStat:', error);
            throw new Error(error);
        }
    }

    loadCron(): void {
        
        cron.schedule('1 0 1 1 *', async () => {
            try {
                await this.dbConnectionNT();
                await this.dbConnectionStat();
            } catch (error) {
                console.error('Error ejecutando el cron:', (error as Error).message);
            }
        });
    }

    async startServer() {
        try {
            await this.validateConnections();
            console.log('Conexiones validadas correctamente.');
            await TableNextYearNT();
            await TableNextYearStat();
            this.loadCron();
            console.log('Servidor iniciado y tareas programadas.');
        } catch (error) {
            console.error('Error al iniciar el servidor:', (error as Error).message);
            throw error;
        }
    }
}

export default Server;
