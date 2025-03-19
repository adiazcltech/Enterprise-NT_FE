import 'dotenv/config';
import Server from './models/server';

(async function main(): Promise<void> {
    try {
        const server = new Server();
        await server.startServer(); // Llama al método que valida las conexiones y carga el cron
        console.log('Servidor iniciado correctamente.');
    } catch (error) {
        // Validar el tipo de error
        if (error instanceof Error) {
            console.error('Error al iniciar el servidor:', error.message);
        } else {
            console.error('Error desconocido al iniciar el servidor:', error);
        }
        process.exit(1); // Termina el proceso si algo falla
    }
})();

