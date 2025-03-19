import { DataTypes } from "sequelize";
import { db } from "../../db/config/conection";
import { getDateType } from "../dbTypes";

const mainCubetemplate = db.define('lab35', {
    lab35c1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true, // Configurar como autoincremental
        primaryKey: true, // Es clave primaria
    },
    lab35c2: {
        type: 'VARCHAR(50)',
        allowNull: false,
    },
    lab35c3: {
        type: 'VARCHAR(1050)',
        allowNull: true,
    },
    lab35c4: {
        type: 'VARCHAR(1050)',
        allowNull: true,
    },
    lab35c5: {
        type: 'VARCHAR(1050)',
        allowNull: true,
    },
    lab35c6: {
        type: getDateType(db),
        allowNull: false,
    },
    lab35c7: {
        type: getDateType(db),
        allowNull: false,
    },
    lab35c8: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    lab35c9: {
        type: 'VARCHAR(1050)',
        allowNull: true,
    },
    lab35c10: {
        type: 'VARCHAR(1050)',
        allowNull: true,
    },
    lab35c11: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    lab35c12: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    lab35c13: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'lab35',
    timestamps: false, // Si no hay createdAt y updatedAt
});

export default mainCubetemplate;