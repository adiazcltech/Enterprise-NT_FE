import { DataTypes, Sequelize } from 'sequelize';

// Función para obtener el tipo de dato para DATE o TIMESTAMP
export const getDateType = (dbConnection : Sequelize) => {
    const dbType = dbConnection.getDialect();

    if (dbType === 'mssql') {
        // En SQL Server, puedes especificar que deseas usar 'DATETIME' directamente
        return 'DATETIME' // Este es el tipo que Sequelize interpretará como DATETIME en SQL Server
       
    } else if (dbType === 'postgres') {
        // PostgreSQL generalmente usa TIMESTAMP
        return  'TIMESTAMP' // Este es el tipo que Sequelize interpretará como TIMESTAMP en PostgreSQL
        
    }

    // Valor predeterminado (para otras bases de datos)
    return DataTypes.DATE;
};

// Función para obtener el tipo de dato para BlOB o BYTEA
export const getBlobType = (dbConnection : Sequelize) => {
    const dbType = dbConnection.getDialect();

    if (dbType === 'mssql') {
        // En SQL Server, puedes especificar que deseas usar 'VARBINARY' directamente
        return 'IMAGE' // Este es el tipo que Sequelize interpretará como VARBINARY en SQL Server
    } else if (dbType === 'postgres') {
        // PostgreSQL generalmente usa BYTEA
        return 'BYTEA' // Este es el tipo que Sequelize interpretará como BYTEA en PostgreSQL
    }

    // Valor predeterminado (para otras bases de datos)
    return DataTypes.BLOB;
};

export const getTinyIntType = (dbConnection : Sequelize) => {
    const dbType = dbConnection.getDialect();

    if (dbType === 'mssql') {
        // En SQL Server, puedes especificar que deseas usar 'TINYINT' directamente
        return 'TINYINT' // Este es el tipo que Sequelize interpretará como TINYINT en SQL Server
    } else if (dbType === 'postgres') {
        // PostgreSQL generalmente usa BYTEA
        return 'SMALLINT' // Este es el tipo que Sequelize interpretará como SMALLINT en PostgreSQL
    }

    // Valor predeterminado (para otras bases de datos)
    return DataTypes.TINYINT;
}