import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { ExamAttempt, Anwser, Mistake, GeneralCritereaImpact, Argument2, ExamAttempt2 } from '../../_models/examAttempt';
import { ExamAttemptService } from '../../_services/examAttempt.service';
import { ExamService } from '../../_services/exam.service';
import { ExamAttemptDataTransferService, critereaDisplay } from '../../_services/examAttempt-datatransfer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Exam, ExamFull, Question2 } from '../../_models/exam';
import { Question, Argument } from '../../_models/question';
import { MistakeService } from '../../_services/mistake.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GeneralCritereaImpactService } from '../../_services/generalCritereaImpact.service';

@Component({
    moduleId: module.id,
    selector: "examAttempt-edit",
    templateUrl: 'examAttempt-edit.component.html'

})

export class ExamAttemptEditComponent implements OnInit {
    currentUser: User;
    loading: boolean;
    currentExam: ExamFull;
    currentAttempt: ExamAttempt2;
    currentQuestion: Question2;
    currentQuestionIndex: number;
    questionDisplayList: Question2[];

    critereaDisplayList: critereaDisplay[];

    myForm: FormGroup;

    constructor(private userService: UserService,
        private examAttemptService: ExamAttemptService,
        private mistakeService: MistakeService,
        private generalCritereaImpactService: GeneralCritereaImpactService,
        private examService: ExamService,
        private _fb: FormBuilder,
        private router: Router,
        private examAttemptDataTransferService: ExamAttemptDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let i: number;
        this.currentQuestionIndex = 0;
        this.questionDisplayList = [];
        this.critereaDisplayList = [];
        this.loading = true;

        this.currentExam = this.examAttemptDataTransferService.currentExam;
        this.currentAttempt = this.examAttemptDataTransferService.currentExamAttempt;
        console.log("big exam", this.currentExam);/**/

        //taking care of questions and their grouping
        this.currentExam.questions.forEach(element => {
            if (element.parentQuestionID == null) {
                this.questionDisplayList.push({
                    id: element.id, examID: element.examID, parentQuestionID: null,
                    seqencialNumber: element.seqencialNumber, text: element.text, proposedWeight: element.proposedWeight, finalWeight: element.finalWeight,
                    arguments: [], tags: [], childs: []
                });
            }
            else {
                i = this.questionDisplayList.findIndex(x => x.id === element.parentQuestionID);
                this.questionDisplayList[i].childs.push(element);
            }
        });

        this.currentExam.examCriterea.forEach(ec => {
            this.critereaDisplayList.push({
                name: ec.name, examCritereaID: ec.id, adjustment: 0, calculated: 0, total: 0
            });
        });

        this.currentQuestion = this.currentExam.questions[this.currentQuestionIndex];
        this.myForm = this.initAnwser(this.currentQuestion);
        this.updateStats(this.currentQuestionIndex);
    }

    initAnwser(currentQuestion: Question2) {
        let a: Anwser = this.currentAttempt.anwsers.find(x => x.questionID === currentQuestion.id);
        let comp: string;

        console.log("a", a);
        if (a.total != null) {
            if (a.mistakes.length != 0) { comp = "Attempted" }
            else if (a.total == 100 && a.mistakes.length === 0) { comp = "Correct" }
            else if (a.mistakes.length === 0) { comp = "Blank" }
        }

        let temp = this._fb.group({
            questionText: [currentQuestion.text],
            questionID: [currentQuestion.id],
            completion: [comp],
            total: [a.total],
            adjustment: [a.adjustment],
            note: [a.note],

            arguments: this._fb.array(this.initArguments(currentQuestion.arguments, a)),
            mistakes: this._fb.array(a.mistakes),

            childs: this._fb.array([])
        });

        if (currentQuestion.childs != null) {
            currentQuestion.childs.forEach(element => {
                temp.value.childs.push(this.initAnwser(element));
            });
        }
        return temp;
    }

    initArguments(args: Argument[], a: Anwser) {
        let arr: any[] = [];
        let temp: any, b: boolean = false;


        args.forEach(element => {
            b = false;
            if (a.mistakes.find(x => x.argumentID === element.id)) { b = true; }
            temp = this._fb.group({
                id: [element.id],
                authorID: [element.authorID],
                parentArgumentID: [element.parentArgumentID],
                questionID: [element.questionID],

                text: [element.text],
                advice: [element.advice],
                defaultWeight: [element.defaultWeight],
                variable: [element.variable],
                minMistakeText: [element.minMistakeText],
                maxMistakeText: [element.maxMistakeText],
                minMistakeWeight: [element.minMistakeWeight],
                maxMistakeWeight: [element.maxMistakeWeight],

                argumentCritereas: [element.argumentCritereas],
                apliesTo: [b]
            });


            arr.push(temp);
        });
        return arr;
    }

    ngOnInit() {

    }

    moveTo(i: number) {
        this.currentQuestionIndex = i;
        this.currentQuestion = this.questionDisplayList[this.currentQuestionIndex];
    }

    changeCompletion() {
        let val: number = 0;
        console.log("completion", this.myForm.value.completion);
        if (this.myForm.value.completion !== "Blank") { val = 100; }
        this.myForm.value.total = val;
    }

    changeSlider(value: any, argID: number, questionID: number) {
        console.log("value", value, "argument", argID, "question", questionID);

        let argument = this.currentExam.questions.find(x => x.id === questionID).arguments.find(x => x.id === argID);
        let i = this.currentAttempt.anwsers.findIndex(x => x.questionID === questionID);
        let index = this.currentAttempt.anwsers[i].mistakes.findIndex(x => x.argumentID === argID);

        console.log("argument.maxMistakeWeight", argument.maxMistakeWeight, "argument.minMistakeWeight", argument.minMistakeWeight);
        this.currentAttempt.anwsers[i].mistakes[index].adjustedWeight = Math.round(argument.defaultWeight * ((argument.maxMistakeWeight - value) / argument.maxMistakeWeight));
        this.updateStats(i);
    }

    /** Adds or removes the justification
     * @param value 
     * @param argID 
     * @param questionID 
     */
    changeArg(value: any, argID: number, questionID: number) {
        console.log("value", value, "argument", argID, "question", questionID);
        this.loading = true;
        let qindex = this.currentExam.questions.findIndex(x => x.id === questionID);
        let question = this.currentExam.questions[qindex];
        let argument = question.arguments.find(x => x.id === argID);
        let anwserIndex = this.currentAttempt.anwsers.findIndex(x => x.questionID === questionID);

        //new mistake
        if (value === true) {
            //create mistake
            let newMistatake: Mistake = {
                id: null,
                adjustedWeight: argument.defaultWeight,

                argumentID: argID,
                anwserID: this.currentAttempt.anwsers[anwserIndex].id
            };

            //add to the server
            this.mistakeService.create(newMistatake).subscribe(data => {
                this.currentAttempt.anwsers[anwserIndex].mistakes.push(newMistatake);
                (<FormArray>this.myForm.controls['mistakes']).push(this._fb.group(data));
                
                //add all of the criterea impacts
                let criterea: GeneralCritereaImpact[] = [];
                let gc: GeneralCritereaImpact;
                argument.argumentCritereas.forEach(ac => {
                    gc = {
                        anwserID: this.currentAttempt.anwsers[anwserIndex].id,
                        examAttemptID: this.currentAttempt.id,
                        examCritereaID: ac.examCritereaID,
                        mistakeID: data.id,
                        weight: ac.severity
                    };
                    console.log(JSON.stringify(gc));
                    criterea.push(gc);
                });/**/
                
                this.generalCritereaImpactService.createMany(criterea).subscribe(data => {
                    newMistatake.id = data.id;

                    this.currentAttempt.anwsers[anwserIndex].total -= argument.defaultWeight;
                    

                    this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                        this.currentAttempt = data;
                        this.loading = false;
                        this.updateStats(qindex);
                    });/**/
                });

            });
        }
        //remove mistake
        else {

            let m = this.currentAttempt.anwsers[anwserIndex].mistakes.find(x => x.argumentID === argID);

            let mi = this.currentAttempt.anwsers[anwserIndex].mistakes.findIndex(x => x.argumentID === argID);
            for (var i = this.currentAttempt.generalCritereaImpacts.length - 1; i >= 0; i) {
                if (this.currentAttempt.generalCritereaImpacts[i].anwserID === m.id) {
                    this.currentAttempt.generalCritereaImpacts.splice(i, 1);
                }
            }
    
            this.currentAttempt.anwsers[anwserIndex].mistakes.splice(mi, 1);
            this.currentAttempt.anwsers[anwserIndex].total += argument.defaultWeight;
            this.updateStats(qindex);
            /*this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                this.currentAttempt = data;
            });*/
            //remove general criterea
        }

        console.log("current", this.currentAttempt);

    }

    /**Adjusts a justification to a certian level
     * @param to 
     * @param i 
     */
    adjustImpact(to: number, i: number) {
        this.critereaDisplayList[i].adjustment = +to;
        this.critereaDisplayList[i].total = this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;

        //update mistake
    }

    updateStats(anwserIndex?: number) {
        //calculate and push to server
        if (anwserIndex != -1) {
            this.currentAttempt.anwsers[anwserIndex].total = 100;
            this.currentAttempt.anwsers[anwserIndex].mistakes.map(x => this.currentAttempt.anwsers[anwserIndex].total -= x.adjustedWeight)
        }

        this.currentAttempt.total = 0;
        this.currentAttempt.anwsers.map(x => this.currentAttempt.total += x.total);

        let sum: number = 0, index: number = 0;

        //calculate the criteras
        for (var i = 0; i < this.critereaDisplayList.length; i++) {
            sum = 0;
            var element = this.critereaDisplayList[i];

            this.currentAttempt.generalCritereaImpacts.map(y => {
                //console.log(y.anwserID, y, element)
                if (y.examCritereaID == element.examCritereaID)
                    sum += y.weight
            });

            // console.log("sum", sum, "element", element);
            this.critereaDisplayList[i].calculated = sum;
            this.critereaDisplayList[i].total = this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;
        }
    }

}