import { Censor } from './censor';
export class ExamAttempt {
    id: number;
    total: number;
    finalTotal: number;
    censorshipDate: string;
    gradingDate: string;

    gradeID: number;
    examID: number;
    censorID: number;
    studentID: number;

    anwsers: Anwser[];
    generalCritereaImpacts :GeneralCritereaImpacts[];
}

export class Anwser{
    id: number;
    total: number;
    finalTotal: number;
    censorshipDate: string;
    note: string;

    examAttemtID: number;
    questionID: number;

    mistakes: Mistake[];
}

export class Mistake{
    id: number;
    adjustedWeight: number;

    argumentID: number;
    anwserID: number;
}

export class GeneralCritereaImpacts{
    id: number;
    weight: number;

    examAttemtID: number;
    anwserID: number;
    mistakeID: number;
    examCritereaID: number;
}

