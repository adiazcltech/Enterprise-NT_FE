import { DataTypes } from 'sequelize';
import { dbDoc } from '../../db/config/conection';
import { getBlobType, getDateType, getTinyIntType } from '../dbTypes';



const ducumentResult = dbDoc.define('doc02', {
    lab22c1: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Id de la orden',
        primaryKey: true // Como en el SQL
    },
    lab39c1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID prueba',
        primaryKey: true // Como en el SQL
    },
    doc02c1: {
        type: 'VARCHAR(128)',
        allowNull: false,
        comment: 'Nombre del archivo',
        primaryKey: true // Como en el SQL
    },
    doc02c2: {
        type: getBlobType(dbDoc),
        allowNull: true, // En el SQL es NOT NULL
        //comment: 'Archivo'
    },
    doc02c3: {
        type: getDateType(dbDoc),
        allowNull: false
        //comment: 'Fecha de registro'
    },
    doc02c4: {
        type: 'VARCHAR(16)',
        allowNull: false,
        //comment: 'Tipo de archivo'
    },
    doc02c5: {
        type: 'VARCHAR(4)',
        allowNull: false,
        //comment: 'Extensión'
    },
    doc02c6: {
        type: getTinyIntType(dbDoc),
        allowNull: true // En el SQL es NULL

        //comment: 'Ver en reportes'
    },
    lab04c1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //comment: 'Id del usuario'
    },
    doc02c7: {
        type: 'VARCHAR(228)',
        allowNull: true,
        //comment: 'Ruta del archivo'
    }
}, {
    tableName: 'doc02',
    timestamps: false, // Si no hay campos createdAt y updatedAt
    indexes: [
        {
            fields: ['doc02c1']
        }
    ]
});
ducumentResult.afterSync(async () => {
    const dbType = dbDoc.getDialect();
    
    if (dbType === 'mssql') {
        // Ejecuta una sentencia ALTER TABLE para agregar el defaultValue en SQL Server
        await dbDoc.query(`
            IF NOT EXISTS (
                SELECT * FROM information_schema.columns 
                WHERE table_name = 'doc02' AND column_name = 'doc02c6'
            )
            BEGIN
                ALTER TABLE doc02 ADD CONSTRAINT DF_doc02_doc02c6 DEFAULT 1 FOR doc02c6;
            END
        `);
    } else if (dbType === 'postgres') {
        // Ejecuta una sentencia ALTER TABLE para agregar el defaultValue en PostgreSQL
        await dbDoc.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'doc02' AND column_name = 'doc02c6'
                ) THEN
                    ALTER TABLE doc02 ADD COLUMN doc02c6 smallint DEFAULT 1;
                END IF;
            END $$;
        `);
    }
});
export default ducumentResult;
