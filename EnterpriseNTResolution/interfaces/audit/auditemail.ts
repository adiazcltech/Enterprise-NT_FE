interface AuditEmail {
    recipients: string;
    body: string;
    attachments: number,
    subject:string,
    user: number, 
    date: any,
    order?: string
    tests?: string
}