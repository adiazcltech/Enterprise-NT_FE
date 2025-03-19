import nodemailer from 'nodemailer';
import { getValueKey, getValueKeyWebQuery  } from '../tools/common';
import { insertAudit } from '../db/tools/audit/auditemail';
import moment from 'moment';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';
import path from 'path';

export const sendEmail = async (email: Email) => {
    return new Promise(async (resolve, reject) => {
        try {

            const getValue = email.webquery ? getValueKeyWebQuery  : getValueKey;

            const typeServer = await getValue('ServidorCorreo');
            const host = await getValue('SmtpHostName');
            const port = await getValue('SmtpPort');
            const auth = await getValue('SmtpAuthUser');
            const passwordEmail = await getValue('SmtpPasswordUser');
          

            const attachments: any = [];
            if (email.attachment !== undefined && email.attachment.length > 0) {
                email.attachment.forEach((value: Image) => {
                    if (value.type === '1') {
                        if (typeServer !== 'OUTLOOKTOKEN') {
                            attachments.push({
                                filename: value.filename,
                                content: Buffer.from(value.path, 'base64'),
                                encoding: 'base64'
                            });
                        } else {
                            attachments.push({
                                "@odata.type": "#microsoft.graph.fileAttachment",
                                name: path.basename(value.filename),
                                contentType: "application/octet-stream",
                                contentBytes: value.path
                            });
                        }
                    }
                    
                })
            }

            const recipients: string[] = [];
            const recipientsoutlooktoken: object[] = [];
            email.recipients.forEach((value) => {
                if (value) {
                    if (typeServer !== 'OUTLOOKTOKEN') {
                        recipients.push(value.replace(/\s/g, '').replace(/\[|\]/g, ''));
                    }
                    else {
                        recipientsoutlooktoken.push({ emailAddress: { address: value.replace(/\s/g, '').replace(/\[|\]/g, '') } });
                    }
                }
            });

            const message = {
                from: auth,
                to: recipients.join(', '),
                recipients: recipientsoutlooktoken,
                subject: email.subject,
                html: email.body,
                attachments: attachments,
            };

        
            if(typeServer === 'OUTLOOKTOKEN'){
                
                const accessToken = await getToken(email.webquery); // Esto sigue siendo el flujo de credenciales de cliente
                await sendEmailtoken(accessToken, auth, message);
                insertAuditEmail(email);
                resolve(true);1
            }
            else if (typeServer !== 'OUTLOOK') {
                const transporter = nodemailer.createTransport({
                    host: host,
                    port: port,
                    secure: true,
                    auth: {
                        user: auth,
                        pass: passwordEmail,
                    },
                });

                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.error('Error al enviar el correo:', error);
                        resolve("Se a generado un error a la hora de hacer el envio");
                    } else {
                        insertAuditEmail(email);
                        console.log('Correo enviado con éxito:', info.response);
                        resolve(true);
                    }
                });

                
            } else {
                    const transporter = nodemailer.createTransport({
                        service: 'hotmail',
                        auth: {
                            user: auth,
                            pass: passwordEmail,
                        },
                    });

                    transporter.sendMail(message, (error, info) => {
                        if (error) {
                            console.error('Error al enviar el correo:', error);
                            resolve(false);
                        } else {
                            insertAuditEmail(email);
                            console.log('Correo enviado con éxito:', info.response);
                            resolve(true);
                        }
                    });
            }
        } catch (error) {
            console.error('Error en el proceso de envío de correo:', error);
            reject(error);
        }
    });
}


const getToken = async (webquery : Boolean): Promise<string> => {
    try {
        const getValue = webquery ? getValueKeyWebQuery : getValueKey;
        const clientId = await getValue('clientIdEmail');
        const authority =  await getValue('authorityEmail');
        const clientSecret = await getValueKey('clientSecretEmail');

        const config = {
            auth: {
                clientId: clientId,
                authority: "https://login.microsoftonline.com/" + authority,
                clientSecret:  clientSecret
            }
        };
        
        const cca = new ConfidentialClientApplication(config);

        const result = await cca.acquireTokenByClientCredential({
            scopes: ["https://graph.microsoft.com/.default"],
        });

        // Verificar si result es null
        if (!result || !result.accessToken) {
            throw new Error("No se pudo obtener el token.");
        }

        return result.accessToken;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        throw error; // Puedes lanzar el error nuevamente o manejarlo de otra manera
    }
};

const sendEmailtoken = async (accessToken: string, userId: string, parameter: any) => {
    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    const email = {
        message: {
            subject: parameter.subject,
            body: {
                contentType: "Html",
                content: parameter.html
            },
            toRecipients: parameter.recipients,
            attachments: parameter.attachments
        },
        saveToSentItems: "false"
    };

    await client.api(`/users/${userId}/sendMail`).post({ message: email.message });
};


export const insertAuditEmail = async (email: Email) => {
    const audit: AuditEmail = {
        recipients: email.recipients.join(','),
        body: email.body,
        attachments: email.attachment !== undefined && email.attachment.length > 0 ? 1 : 0,
        subject: email.subject,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        user: email.user,
        order: email.order
    }
    await insertAudit(audit);
}