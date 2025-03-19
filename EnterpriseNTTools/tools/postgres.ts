import { QueryTypes } from "sequelize";
export const geyKeysPostgreSQL = async (table: string, year: number, conection: any) => {
    try {
        const query = `
            SELECT 
            column_name,
            constraint_name
            FROM 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE 
            TABLE_NAME = :tableName
            ORDER BY 
            ORDINAL_POSITION
        `;

        const keys = await conection.query(query, {
            replacements: { tableName: table },
            type: QueryTypes.SELECT,
        });

        // Agrupar las columnas por nombre de la llave
        const keysList: any = [];
        keys.forEach((value: any) => {
            const find = keysList.find((i: any) => i.name === value.constraint_name);
            if (!find) {
                const key: any = {
                    name: value.constraint_name,
                    columns: []
                };
                key.columns.push(value.column_name);
                keysList.push(key);
            } else {
                find.columns.push(value.column_name);
            }
        });

        for (const key of keysList) {
            const newName = `${key.name}_${year}`;
            await deleteKeyPostgreSQL(conection, table, key.name);
            await addKeyPostgreSQL(conection, table, newName, key.columns);
        }

        return keysList;

    } catch (error) {
        console.error(`Error consultando las llaves de la table ${table}`, error);
    }
}

const deleteKeyPostgreSQL = async (conection: any, table: string, nameKey: string) => {
    const sql = `ALTER TABLE ${table} DROP CONSTRAINT ${nameKey};`;
    try {
        await conection.query(sql);
        console.log(`Llave eliminada con éxito: ${nameKey}`);
    } catch (error: any) {
        console.error(error.message);
    }
};

export const addKeysPostgreSQL = async (table: string, keys: any, conection: any) => {
    try {
        for (const key of keys) {
            await addKeyPostgreSQL(conection, table, key.name, key.columns);
        }
    } catch (error: any) {
        console.log(`Error agregando las llaves a la tabla ${table}`);
    }
};

const addKeyPostgreSQL = async (conection: any, table: string, newName: string, columns: string[]) => {
    let count = await validateKey(conection, table, newName);
    while (count === 1) {
        newName += "_";
        count = await validateKey(conection, table, newName);
    }
    const sql = `ALTER TABLE ${table} ADD CONSTRAINT ${newName} PRIMARY KEY (${columns.join(', ')});`;
    try {
        await conection.query(sql);
        console.log(`Llave agregada con éxito: ${newName}`);
    } catch (error: any) {
        console.error(error.message);
    }
};


export const geyIndexesPostgreSQL = async (table: string, year: number, conection: any, rename: string) => {
    //rename es un string 
    //YD para renombrar indices de una tbla del año anterior O POSTERIOR (YEAR DIFERENT)
    //YN para renombrar indices de la tabla del año actual (YEAR NOW)
    //N para no renombrar  (NO)
    try {
        const query = `
        SELECT
            idx.indexname AS name,
            idx.indexdef AS query
            FROM pg_indexes idx
            LEFT JOIN information_schema.table_constraints tc ON idx.indexname = tc.constraint_name
            WHERE idx.tablename = '${table}' AND tc.constraint_type IS NULL;
        `;

        const indexes = await conection.query(query, {
            replacements: { tableName: table },
            type: QueryTypes.SELECT,
        });

        // Agrupar las columnas por nombre del indice
        const indexesList: any = [];

        indexes.forEach((index: any) => {
            const find = indexesList.find((i: any) => i.name === index.name);
            if (!find) {
                indexesList.push({
                    name: index.name,
                    query: index.query
                });
            }
        });

        // Renombrar cada indice
        if (rename !== 'N') {
            for (const index of indexesList) {
                let newName = '';
                switch (rename) {
                    case 'YD':
                        newName = `${index.name}_${year}_${Math.floor(Math.random() * 1000)}`;
                        await renameIndexPostgreSQL(conection, table, index.name, newName);
                        break;
                    case 'YN':
                        newName = index.name.replace(`_${year}`, '');;
                        await renameIndexPostgreSQL(conection, table, index.name, newName);
                        break;

                    default:
                        break;
                }
            }
        }
        return indexesList;

    } catch (error) {
        console.error(`Error consultando las llaves de la table ${table}`, error);
    }
}

const renameIndexPostgreSQL = async (conection: any, table: string, nameIndex: string, newName: string) => {
    let count = await validateIndex(conection, table, newName);
    while (count === 1) {
        newName += "_";
        count = await validateIndex(conection, table, newName);
    }
    const sql = `ALTER INDEX ${nameIndex} RENAME TO ${newName};`;
    try {
        await conection.query(sql);
        console.log(`Indice renombrado con éxito: ${newName}`);
    } catch (error: any) {
        console.error(error.message);
    }
};

const validateIndex = async (conection: any, table: string, name: string) => {
    try {
        const [exists]: any = await conection.query(`SELECT count(*) FROM pg_indexes WHERE tablename = '${table}' AND indexname = '${name}';`);
        return exists[0].count;
    } catch (error: any) {
    }
}

const validateKey = async (conection: any, table: string, name: string) => {
    try {
        const [exists]: any = await conection.query(`SELECT count(*) FROM information_schema.table_constraints WHERE table_name = '${table}' AND constraint_type = 'PRIMARY KEY' AND constraint_name = '${name}'; `);
        return exists[0].count;
    } catch (error: any) { }
}

export const addIndexPostgreSQL = async (table: string, indexes: any, conection: any, add: string) => {
    try {
        for (const index of indexes) {
            await createIndexPostgreSQL(conection, index.query, table, index.name + add);
        }
    } catch (error: any) {
        console.log(`Error agregando los Índices a la tabla ${table}`, error);
    }
};


export const setSequence = async (table: string, columns: any, nextYear: any, db: any) => {

    // Iterar sobre las columnas para crear nuevas secuencias
    for (let col of columns) {
        const columnName = col.column_name;
        const oldSeqName = col.column_default.split("'")[1]; // Extraer el nombre de la secuencia original
        const newSeqName = `${table}_${nextYear}_${oldSeqName.split('_')[1]}`; // Crear nuevo nombre para la secuencia

        const lastValueQuery = `SELECT start_value, increment_by, min_value, max_value
                            FROM pg_sequences
                            WHERE schemaname = 'public' and sequencename = '${oldSeqName}';`;
        console.log(lastValueQuery)
        const [lastValue] = await db.query(lastValueQuery);

        // comprobar si existe la secuencia
        const [exists]: any = await db.query(`SELECT count(*) as count FROM information_schema.sequences WHERE sequence_name =  '${newSeqName}'`);
        // Crear la nueva secuencia con el mismo valor que la original
        if ((exists.length > 0 && ( exists[0].count === 0 || exists[0].count === '0')) || exists === undefined || exists.length === 0) {
            const seqQuery = `
                            CREATE SEQUENCE ${newSeqName}
                            START WITH ${lastValue[0].start_value}
                            INCREMENT BY ${lastValue[0].increment_by}
                            MINVALUE ${lastValue[0].min_value}
                            MAXVALUE ${lastValue[0].max_value}
                            ;
                        `
            console.log(seqQuery)
            await db.query(seqQuery);
            console.log(`Secuencia ${newSeqName} creada con éxito`);
        }
        // Asignar la nueva secuencia a la columna en la nueva tabla
        console.log(`ALTER TABLE ${table}_${nextYear} ALTER COLUMN ${columnName} SET DEFAULT nextval('${newSeqName}');`);
        await db.query(`ALTER TABLE ${table}_${nextYear} ALTER COLUMN ${columnName} SET DEFAULT nextval('${newSeqName}');`);
    }
}

const createIndexPostgreSQL = async (conection: any, query: string, table: string, name: string) => {
    try {
        await conection.query(query.replace(/INDEX\s+.*?\s+ON/, `INDEX ${name} ON`));
        console.log(`Indice ${name} agregado a la tabla ${table}`);
    } catch (error: any) {
        console.log(`Error agregando el Índice`, error);
    }
}
