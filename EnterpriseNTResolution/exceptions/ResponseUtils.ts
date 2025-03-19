export class EnterpriseNTTokenException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnterpriseNTTokenException';
    }
}

export class ResponseHandler {
    

    public message: string;
    public host: string;
    public date: Date;
   

    // Constructor que recibe los valores iniciales
    constructor() {
        
        this.message = '';
        this.host = 'resolution';
        this.date = new Date();
    }

    // Método para generar una respuesta exitosa
    static sendResponse( message: string ) {
        return {  
          
            message: message || 'Operation was successful' ,
            host:  'resolution',
            date: new Date()
            
        };
    }
  
    // Método para manejar errores
    static sendErrorResponse(errorMessage: string) {
        return { 
            message: errorMessage || 'An error occurred during the operation' ,
            host:  'resolution',
            date: new Date()
            
        };
    }
}
