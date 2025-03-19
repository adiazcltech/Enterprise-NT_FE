import fs from 'fs';
import { StorageConstanst } from './constants';
import { name } from '@azure/msal-node/dist/packageMetadata';

export const manageStorage = async () => {
    // CREAR UNA CARPETA EN EL SISTEMA DE ARCHIVOS GUIANDOSE POR LA VARIABLE DE ENTORNO UPLOAD_FOLDER
    if (StorageConstanst.DIR_STORAGE && !fs.existsSync(StorageConstanst.DIR_STORAGE)) {
        //crear carpetas y subcarpetas la ultima carpeta se va llamar storage_NT ES DECIR CONCATENARSELO A UPLOAD_FOLDER
        fs.mkdirSync(StorageConstanst.DIR_STORAGE , { recursive: true });

        console.log(`se creo la carpeta storage_NT en el directorio de archivos ${StorageConstanst.DIR_STORAGE}`)
        
    }
}

export const dbToFile = async (file: string, path: string,name:string ) => {
    // COMPROBAR SI EL PATH EXISTE Y SI NO EXISTE CREARLO


    if (path && !fs.existsSync(path)) {
        console.log("no existe el path");
        fs.mkdirSync(path , { recursive: true });
    }
    // remover los espacios en blanco del nombre del archivo
    const absolutepath = `${path}/${name.replace(/ /g, "_")}`;
    
    try {
        await fs.promises.writeFile(absolutepath, file, 'base64'); // Cambia esto a fs.promises.writeFile
        return true; // Devuelve true si se guarda correctamente
    } catch (err) {
        console.log("errorxd", err);
        return false; // Devuelve false en caso de error
    }
}