interface Email {
    recipients: string[];
    subject: string;
    body: string;
    attachment?: Image[];
    order?: string
    tests?: string,
    webquery: boolean,
    user: number
}