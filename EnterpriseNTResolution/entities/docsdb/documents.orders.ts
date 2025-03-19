import { DataTypes } from 'sequelize';
import { dbDoc } from '../../db/config/conection';
import { getBlobType, getDateType, getTinyIntType } from '../dbTypes';




const documentOrders = dbDoc.define('doc01', {
    lab22c1: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // comment: 'ID de orden',
        primaryKey: true // Clave primaria
    },
    doc01c1: {
        type: 'VARCHAR(128)',
        allowNull: false,
        // comment: 'Nombre del archivo',
        primaryKey: true // Clave primaria compuesta
    },
    doc01c2: {
        type: getBlobType(dbDoc),
        allowNull: true,
        // comment: 'Contenido del archivo'
    },
    doc01c3: {
        type: getDateType(dbDoc),
        allowNull: false,
        // comment: 'Fecha de creación'
    },
    doc01c4: {
        type: 'VARCHAR(16)',
        allowNull: false,
        //comment: 'Tipo de archivo'
    },
    doc01c5: {
        type: 'VARCHAR(4)',
        allowNull: false,
        //comment: 'Extensión del archivo'
    },
    lab04c1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //comment: 'ID del usuario'
    },
    doc01c6: {
        type: getTinyIntType(dbDoc),
        allowNull: true,
        //comment: 'Estado del archivo'
    }
    , doc01c7: {
        type: 'VARCHAR(228)',
        allowNull: true,
        //comment: 'Ruta del archivo'
    }
}, {
    tableName: 'doc01',
    timestamps: false, // Si no hay createdAt y updatedAt
    indexes: [
        {
            unique: true,
            fields: ['lab22c1', 'doc01c1'] // Índice único compuesto
        }
    ]
});
documentOrders.afterSync(async () => {
    const dbType = dbDoc.getDialect();
    
    if (dbType === 'mssql') {
        // Ejecuta una sentencia ALTER TABLE para agregar el defaultValue en SQL Server
        await dbDoc.query(`
            IF NOT EXISTS (
                SELECT * FROM information_schema.columns 
                WHERE table_name = 'doc01' AND column_name = 'doc01c1'
            )
            BEGIN
                ALTER TABLE doc01 ADD CONSTRAINT DF_doc01_doc01c6 DEFAULT 1 FOR doc01c6;
            END
        `);
    } else if (dbType === 'postgres') {
        // Ejecuta una sentencia ALTER TABLE para agregar el defaultValue en PostgreSQL
        await dbDoc.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'doc01' AND column_name = 'doc01c6'
                ) THEN
                    ALTER TABLE doc01 ADD COLUMN doc01c6 smallint DEFAULT 1;
                END IF;
            END $$;
        `);
    }
});

export default documentOrders;
