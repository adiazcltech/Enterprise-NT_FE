// Tipo de los datos originales
type ManagementItem = {
    orderNumber: string;
    patient?: {
        patientId?: string;
        name1?: string;
        name2?: string;
        lastName?: string;
        surName?: string;
    };
    userValidation?: string;
    tests: {
        id: number;
        code: string;
        name: string;
        interviews:{
            questionId?: number;
            question?: string;
            answerId?: number;
            answerClose?: string;
            answer?: string;
            delta: number | null;
            panic: number | null; 
            critic: number | null;
        }[],
      
        result?: {
            dateResult?: number;
            state?: number;
            userRes?: {
                id?: number;
                userName?: string;
            };
        };
    }[];
};

// Tipo del esquema transformado
type TransformedItem = {
    order: string;
    patientId: string | null;
    name1: string | null;
    name2: string | null;
    lastName: string | null;
    surName: string | null;
    testId: number;
    testCode: string;
    testName: string;
    questionId: number | null;
    question: string | null;
    answerId: number | null;
    answerClose: string | null;
    answer: string | null;
    date: string | null;
    panic: number | null;
    delta: number | null;
    critic: number | null;
    userId: number | null;
    username: string | null;
};