import { DataTypes } from "sequelize";
import { db } from "../../db/config/conection";
import { getDateType } from "../dbTypes";

const mainMigration = db.define('lab995', {
    lab995c1: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,  // Configurar como autoincremental
        //comment: 'ID de registro',
        primaryKey: true // Es clave primaria
    },
    lab22c1: {
        type: DataTypes.BIGINT,
        allowNull: false,
        //comment: 'ID de la orden',
    },
    lab21c1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //comment: 'ID del paciente',
    },

    lab39c1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //comment: 'ID de la prueba',
    },
    lab995c2: {
        type: getDateType(db),
        allowNull: false,
        //comment: 'fecha de registro',
    },
    lab995c3: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        //comment: 'Estado de la migracion',
    },
}, {
    tableName: 'lab995',
    timestamps: false, // Si no hay createdAt y updatedAt
    
});
    
export default mainMigration;