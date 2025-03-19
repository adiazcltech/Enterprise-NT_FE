import { Sequelize } from 'sequelize';

const host = process.env.DB_HOST || 'localhost';
const dbNameNT = process.env.DB_NAME_NT || 'Enterprise_NT';
const dbNameStat = process.env.DB_NAME_STAT || 'Enterprise_NT_Stat';
const user = process.env.DB_USERNAME || 'SA';
const password = process.env.DB_PASSWORD || '12345';
const dialect = process.env.ENGINE === 'postgres' ? 'postgres' : 'mssql';
const logging = process.env.LOGGING === 'true' ? true : false;
const port = process.env.PORTBD || '';

export const dbEnterprise = new Sequelize(dbNameNT, user, password, {
    host: host,
    dialect: dialect,
    port: parseInt(port),
    // dialectOptions: {
    //     options: { 
    //         requestTimeout: 500000,
    //         instanceName: process.env.INSTANCENAME || 'SQL_2012_PRU',
	// 		encrypt: false, 
	// 		trustServerCertificate: true
    //     }
    // },
    logging: logging
});

export const dbStat = new Sequelize(dbNameStat, user, password, {
    host: host,
    dialect: dialect,
    port: parseInt(port),
    // dialectOptions: {
    //     options: { 
    //         requestTimeout: 500000,
    //         instanceName: process.env.INSTANCENAME || 'SQL_2012_PRU',
	// 		encrypt: false, 
	// 		trustServerCertificate: true
    //     }
    // },
    logging: logging
});