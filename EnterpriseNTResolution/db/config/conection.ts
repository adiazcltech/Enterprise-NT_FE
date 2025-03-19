import { Sequelize } from "sequelize";
const port = process.env.PORTDB || '';
export const db = new Sequelize(process.env.DATABASE || 'EnterpriseNT_Aida', process.env.USER || 'SA', process.env.PASSWPORD || '12345', {
    host: process.env.HOST || '192.168.1.22',
    dialect: process.env.ENGINE === 'sqlserver' ? 'mssql' : 'postgres',
    port: parseInt(port),
    // dialectOptions: {
    //     options: { 
    //         requestTimeout: 500000,
    //         instanceName: process.env.INSTANCENAME || 'SQL_2012_PRU',
	// 		encrypt: false, 
	// 		trustServerCertificate: true
    //     }
    // },
    logging: process.env.LOGGING === 'true' || false
});

export const dbStat = new Sequelize(process.env.DATABASE_STAT || 'EnterpriseNT_Aida_Stat', process.env.USER || 'SA', process.env.PASSWPORD || '12345', {
    host: process.env.HOST || '192.168.1.22',
    dialect: process.env.ENGINE === 'sqlserver' ? 'mssql' : 'postgres',
    port: parseInt(port),
    // dialectOptions: {
    //     options: { 
    //         requestTimeout: 500000,
    //         instanceName: process.env.INSTANCENAME || 'SQL_2012_PRU',
	// 		encrypt: false, 
	// 		trustServerCertificate: true
    //     }
    // },
    logging: process.env.LOGGING === 'true' || false
});

export const dbDoc = new Sequelize(process.env.DATABASE_DOC || 'enterprise_nt_SMC_docs', process.env.USER_DB_DOCS || 'SA', process.env.PASSWORD_DB_DOCS || '12345', {
    host: process.env.HOST_DB_DOCS || '192.168.1.22',
    dialect: process.env.ENGINE === 'sqlserver' ? 'mssql' : 'postgres',
    port: parseInt(port),
     dialectOptions: {
        options: { 
             requestTimeout: 500000,
            instanceName: process.env.INSTANCENAME_DB_DOCS || 'SQL_2012_PRU',
			encrypt: false, 
			trustServerCertificate: true
        }
    },
    logging: process.env.LOGGING === 'true' || false
});

