import { dbEnterprise, dbStat } from "./connection";
import moment from 'moment';
import { addIndexSQLServer, geyIndexesSQLServer } from "../tools/sqlserver";
import { addIndexPostgreSQL, addKeysPostgreSQL, geyIndexesPostgreSQL, geyKeysPostgreSQL, setSequence } from "../tools/postgres";
const engine = process.env.ENGINE;


export const tablesNT = [
    'lab03', 'lab144', 'lab159', 'lab160', 'lab179', 'lab180', 'lab191', 'lab204', 'lab205', 'lab212', 'lab22',
    'lab221', 'lab23', 'lab25', 'lab29', 'lab57', 'lab58', 'lab60', 'lab75', 'lab900', 'lab95'
];
export const tablesStat = [
    'sta2', 'sta3', 'sta4'
];
export const renameNT = async () => {

    const lastYear: number = moment().subtract(1, "year").year();
    for (const table of tablesNT) {
        console.log(`Procesando tabla ${table}`);
        await processByTable(table, lastYear, dbEnterprise);
    }
}

export const renameStat = async () => {

    const lastYear: number = moment().subtract(1, "year").year();

    for (const table of tablesStat) {
        await processByTable(table, lastYear, dbStat);
    }
}


const processByTable = async (table: string, year: number, db: any) => {
    const queryInterface = db.getQueryInterface();
    try {
        const [exists]: any = await db.query(`SELECT count(*) as count FROM information_schema.tables WHERE table_name = '${table}'`);
        if (exists.length > 0 && exists[0].count > 0) {
            if (engine === 'sqlserver') {
                await handleSQLServer(table, year, queryInterface, db);
            } else if (engine === 'postgres') {
                await handlePostgres(table, year, queryInterface, db);
            }
        }
    } catch (error) {
        console.error(`Error al clonar la tabla ${table}`, error);
    }
}

const handleSQLServer = async (table: string, year: number, queryInterface: any, db: any) => {
    try {
        const indexes = await geyIndexesSQLServer(table, year, db, 'YD');
        await queryInterface.renameTable(table, `${table}_${year}`);
        const currentYear = moment().year();
        const [existsCurrentYear]: any = await db.query(`SELECT count(*) as count FROM information_schema.tables WHERE table_name = '${table}_${currentYear}'`);
        if (existsCurrentYear.length > 0 && existsCurrentYear[0].count > 0) {
            await queryInterface.renameTable(`${table}_${currentYear}`, table);
            await geyIndexesSQLServer(table, currentYear + 1, db, 'YN');
        } else {
            await db.query(`SELECT * INTO ${table} FROM ${table}_${year} WHERE 1 = 0;`);
            await addIndexSQLServer(table, indexes, db, '');
        }
    } catch (error) {
        console.error(`Error al clonar la tabla ${table}`, error);
    }
}

const handlePostgres = async (table: string, year: number, queryInterface: any, db: any) => {
    const keys = await geyKeysPostgreSQL(table, year, db);
    const indexes = await geyIndexesPostgreSQL(table, year, db, 'YD');
    await queryInterface.renameTable(table, `${table}_${year}`);
    const currentYear = moment().year();
    const [existsCurrentYear]: any = await db.query(`SELECT count(*) as count FROM information_schema.tables WHERE table_name = '${table}_${currentYear}'`);
    if ( existsCurrentYear.length > 0 && existsCurrentYear[0].count > 0) {
        await queryInterface.renameTable(`${table}_${currentYear}`, table);
        await geyIndexesPostgreSQL(table, currentYear + 1, db, 'YN');
    } else {
        await db.query(`CREATE TABLE ${table} (LIKE ${table}_${year} INCLUDING ALL EXCLUDING INDEXES);`);
        await addKeysPostgreSQL(table, keys, db);
        await addIndexPostgreSQL(table, indexes, db, '');
    }
}



export const updateKeys = async () => {
    const [key]: any = await dbEnterprise.query(`SELECT lab98c2 as value FROM lab98 WHERE lab98c1 = 'AniosConsultas'`);
    if (key.length > 0) {
        const value = parseInt(key[0].value);
        await dbEnterprise.query(`UPDATE lab98 SET lab98c2 = '${value + 1}' WHERE lab98c1 = 'AniosConsultas'`);
    }
}


export const TableNextYearNT = async () => {
    for (const table of tablesNT) {
        // obtener el siguiente año con moment
        let nextYear = moment().year() + 1;

        // comprobar si existe la tabla
        const [exists]: any = await dbEnterprise.query(`SELECT count(*) as count FROM information_schema.tables WHERE table_name =  '${table}_${nextYear}'`);
        console.log(exists)
        if ((exists.length > 0 && (exists[0].count === 0 || exists[0].count === '0')) || exists === undefined || exists.length === 0) {
            console.log("entro a crear la tabla")

            //crear nueva tabla vacia del año siguiente

            //Agregar llaves e indices
            //Obtener los indices de la tabla
            if (engine === 'sqlserver') {
                await dbEnterprise.query(`SELECT * INTO ${table}_${nextYear} FROM ${table} WHERE 1 = 0;`);
                const indexes = await geyIndexesSQLServer(table, nextYear, dbEnterprise, 'N');
                await addIndexSQLServer(`${table}_${nextYear}`, indexes, dbEnterprise, `_${nextYear + 1}_${Math.floor(Math.random() * 1000)}`);
            } else {
                // Crear la nueva tabla con la estructura de la tabla original, sin los índices.
                await dbEnterprise.query(`CREATE TABLE ${table}_${nextYear} (LIKE ${table} INCLUDING ALL EXCLUDING INDEXES);`);

                // Obtener los índices de la tabla original
                const indexes = await geyIndexesPostgreSQL(table, nextYear, dbEnterprise, 'N');

                // Añadir los índices a la nueva tabla
                await addIndexPostgreSQL(`${table}_${nextYear}`, indexes, dbEnterprise, `_${nextYear + 1}_${Math.floor(Math.random() * 1000)}`);

                // Obtener las columnas que usan secuencias en la tabla original
                const columnQuery = `
                    SELECT column_name, column_default
                    FROM information_schema.columns
                    WHERE table_name = '${table}' AND column_default LIKE 'nextval%'
                `;
                const [result] = await dbEnterprise.query(columnQuery);

                
                await setSequence( table, result, nextYear, dbEnterprise);
                
            }
        }
    }
}



export const TableNextYearStat = async () => {
    for (const table of tablesStat) {
        // obtener el siguiente año con moment
        let nextYear = moment().year() + 1;

        // comprobar si existe la tabla
        const [exists]: any = await dbStat.query(`SELECT count(*) as count FROM information_schema.tables WHERE table_name =  '${table}_${nextYear}'`);
        if ((exists.length > 0 && exists[0].count === 0) || exists === undefined || exists.length === 0) {
            if (engine === 'sqlserver') {
            //Obtener los indices de la tabla
            const indexes = await geyIndexesSQLServer(table, nextYear, dbStat, 'N');
            //crear nueva tabla vacia del año siguiente
            await dbStat.query(`SELECT * INTO ${table}_${nextYear} FROM ${table} WHERE 1 = 0;`);
            //Agregar llaves e indices
            await addIndexSQLServer(`${table}_${nextYear}`, indexes, dbStat, `_${nextYear + 1}`);
            }
            else {
                // Crear la nueva tabla con la estructura de la tabla original, sin los índices.
                await dbStat.query(`CREATE TABLE ${table}_${nextYear} (LIKE ${table} INCLUDING ALL EXCLUDING INDEXES);`);

                // Obtener los índices de la tabla original
                const indexes = await geyIndexesPostgreSQL(table, nextYear, dbStat, 'N');

                // Añadir los índices a la nueva tabla
                await addIndexPostgreSQL(`${table}_${nextYear}`, indexes, dbStat, `_${nextYear + 1}`);
            }
        }
    }
}
