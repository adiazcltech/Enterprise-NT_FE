import axios from "axios";
const urlServices = process.env.URL_NT || "http://192.168.1.6:8080/Enterprise_NT_PRU/api";

export const sendDataServiceDashboard = async ( data: any, url: any) => {
    await axios.post(url , data).then( (response) => {
        console.log("respuesta taberp" + url)
        return response;
    }).catch( (error) => {
        console.log("Problemas con el servicio de pacientes a bd central" + error);
    });
}

export const sendDataUpdateServiceDashboard = async ( data: any, url: any) => {
    await axios.put(url , data).then( (response) => {
        console.log("respuesta taberp" + url)
        
        return response;
    }).catch( (error) => {
        console.log("Problemas con el servicio de pacientes a bd central" + error);
    });
}

export const decryptData = async (json : any) => {
    let data : any[] = [];
    await axios.patch(urlServices + '/encode/decrypt', json)
        .then(function (response) {
            data = response.data;
            console.log('Respondio encriptación ');
        }).catch(function (error) {
            console.log("Problemas con el servicio de desencriptar datos " + error);
        });
    return data;
}