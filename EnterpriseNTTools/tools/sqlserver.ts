import { QueryTypes } from "sequelize";

export const geyKeysSQLServer = async (table: string, year: number, conection: any) => {
    try {
        const query = `
            SELECT 
            COLUMN_NAME,
            CONSTRAINT_NAME
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
            const find = keysList.find((i: any) => i.name === value.CONSTRAINT_NAME);
            if (!find) {
                const key: any = {
                    name: value.CONSTRAINT_NAME,
                    columns: []
                };
                key.columns.push(value.COLUMN_NAME);
                keysList.push(key);
            } else {
                find.columns.push(value.COLUMN_NAME);
            }
        });

        for (const key of keysList) {
            const newName = `${key.name}_${year}`;
            await renameKeySQLServer(conection, table, key.name, newName);
        }

        return keysList;

    } catch (error) {
        console.error(`Error consultando las llaves de la table ${table}`, error);
    }
}

const renameKeySQLServer = async (conection: any, table: string, nameKey: string, newName: string) => {
    const sql = `
      EXEC sp_rename '${table}.${nameKey}', '${newName}', 'INDEX';
    `;
    try {
        await conection.query(sql);
        console.log(`Llave renombrada con éxito: ${newName}`);
    } catch (error: any) {
        console.error(error.message);
    }
};


export const geyIndexesSQLServer = async (table: string, year: number, conection: any, rename: String) => {
    //rename es un string 
    //YD para renombrar indices de una tbla del año anterior O POSTERIOR (YEAR DIFERENT)
    //YN para renombrar indices de la tabla del año actual (YEAR NOW)
    //N para no renombrar  (NO)

    try {
        const query = `
        SELECT 
            index_name = i.name,
            column_name = c.name,
            is_primary_key = i.is_primary_key,
            is_unique = i.is_unique
        FROM 
            sys.indexes i
        INNER JOIN 
            sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        INNER JOIN 
            sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        WHERE 
            i.object_id = OBJECT_ID(:tableName);
        `;

        const indexes = await conection.query(query, {
            replacements: { tableName: table },
            type: QueryTypes.SELECT,
        });

        // Agrupar las columnas por nombre del indice
        const indexesList: any = [];
        indexes.forEach((key: any) => {
            const find = indexesList.find((i: any) => i.name === key.index_name);
            if (!find) {
                const index: any = {
                    name: key.index_name,
                    columns: [],
                    isPk: key.is_primary_key,
                    isUnique: key.is_unique
                };

                index.columns.push(key.column_name);
                indexesList.push(index);
            } else {
                find.columns.push(key.column_name);
            }
        });

     

        // Renombrar cada indice
        
        if (rename !== 'N') {
            for (const index of indexesList) {
                let newName = '';
                switch (rename) {
                    case 'YD':
                        newName = `${index.name}_${year}_${Math.floor(Math.random() * 1000)}`;
                        await renameIndexSQLServer(conection, table, index.name, newName);
                        break;
                    case 'YN':
                        newName = index.name.replace(`_${year}`, '');

                        await renameIndexSQLServer(conection, table, index.name, newName);
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

const renameIndexSQLServer = async (conection: any, table: string, nameIndex: string, newName: string) => {
    let count = await validateIndex(conection, newName);
    while (count === 1) {
        newName += "_";
        count = await validateIndex(conection, newName);
    }
    const sql = `EXEC sp_rename '${table}.${nameIndex}', '${newName}', 'INDEX';`;
    try {
        await conection.query(sql);
        console.log(`Indice renombrado con éxito: ${newName}`);
    } catch (error: any) {
        console.error(error.message);
    }
};

export const addIndexSQLServer = async (table: string, indexes: any, conection: any, add: string) => {
    try {
        for (const index of indexes) {
            if (index.isPk) {
                await createKeySQLServer(table, index.name + add, index.columns, conection);
            } else {
                await createIndexSQLServer(table, index.name + add, index.columns, index.isPk === 1, index.isUnique === 1, conection);
            }
        }
    } catch (error: any) {
        console.log(`Error agregando los Índices a la tabla ${table}`, error);
    }
};

const createIndexSQLServer = async (table: string, name: string, columns: string[], isPk: boolean, isUnique: boolean, conection: any) => {
    try {
        await conection.query(`CREATE ${isPk ? 'CLUSTERED' : 'NONCLUSTERED'} ${isUnique ? 'UNIQUE' : ''} INDEX ${name} ON ${table} (${columns.join(', ')});`);
        console.log(`Índice ${name} agregado con éxito a la tabla ${table}`);
    } catch (error: any) {
        console.log(`Error agregando el Índice ${name} a la tabla ${table}`, error);
    }
}

export const addKeySQLServer = async (table: string, keys: any, conection: any) => {
    try {
        for (const key of keys) {
            await createKeySQLServer(table, key.name, key.columns, conection);
        }
    } catch (error: any) {
        console.log(`Error agregando las llaves a la tabla ${table}`);
    }
};

const createKeySQLServer = async (table: string, name: string, columns: string[], conection: any) => {
    try {
        await conection.query(` ALTER TABLE ${table} ADD CONSTRAINT ${name} PRIMARY KEY (${columns.join(', ')});`);
        console.log(`llave ${name} agregada con éxito a la tabla ${table}`);
    } catch (error: any) {
        console.log(`Error agregando la llave ${name} a la tabla ${table}`);
    }
}

const validateIndex = async (conection: any, name: string) => {
    try {
        const [exists]: any = await conection.query(` SELECT COUNT(*) as count FROM sys.indexes i JOIN sys.objects o ON i.object_id = o.object_id WHERE i.name = '${name}'`);
        return exists[0].count;
    } catch (error: any) {
    }
}