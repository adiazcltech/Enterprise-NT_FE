import fs from 'fs';
import path from 'path';
import { dbDoc } from '../../db/config/conection';
import { Model } from 'sequelize';

// Directorio donde están tus modelos
const modelsDir = path.join(__dirname);

// Objeto para almacenar los modelos cambiar el nombre si se va a crear otra db
const docsmodels: { [key: string]: typeof Model } = {};

// Función para cargar y sincronizar modelos
const loadModels = async () => {
    const files = fs.readdirSync(modelsDir)
        .filter(file => file.endsWith('.js') && file !== 'index.js'); // Filtra archivos de modelos
    // Cargar y sincronizar modelos en paralelo
    const syncPromises = files.map(async (file) => {
        const modelPath = path.join(modelsDir, file);
        const model = (await import(modelPath)).default;

        docsmodels[model.name] = model;
        
        return model.sync({ alter: true }); // Sincroniza el modelo
    });

    // Esperar a que todos los modelos se sincronicen
    await Promise.all(syncPromises);

   
};

// Ejecutar la función y exportar modelos y conexión
const initializeModels = async () => {
    try {
        // comprobar si esta conectado a la base de datos
        if (dbDoc) {
            await loadModels();
        }
        console.log('Modelos cargados y sincronizados exitosamente');
    } catch (error) {
        console.error('Error al cargar y sincronizar modelos', error);
    }
};

initializeModels();

export { dbDoc, docsmodels };
