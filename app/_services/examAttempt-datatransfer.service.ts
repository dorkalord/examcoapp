import { Injectable } from '@angular/core';
import { Exam } from '../_models/exam';
import { ExamAttempt } from '../_models/examAttempt';
import { Censor } from '../_models/censor';

@Injectable()
export class ExamAttemptDataTransferService {
    constructor() { }

    public examAttempts: ExamAttempt[];
    public currentExam: Exam;
    public currentExamAttempt: ExamAttempt;
    public currentCensor: Censor;
}