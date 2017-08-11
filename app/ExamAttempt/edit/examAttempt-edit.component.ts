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
import { AnwserService } from '../../_services/anwser.service';

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
        private anwserService: AnwserService,
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

        this.currentExam.course.code;
        this.currentAttempt.studentID

        //taking care of questions and their grouping
        this.currentExam.questions.forEach(element => {
            if (element.parentQuestionID == null) {
                this.questionDisplayList.push({
                    id: element.id, examID: element.examID, parentQuestionID: null,
                    seqencialNumber: element.seqencialNumber, text: element.text, proposedWeight: element.proposedWeight, finalWeight: element.finalWeight,
                    arguments: element.arguments, max: element.max,
                    tags: [], childs: []
                });
            }
            else {
                i = this.questionDisplayList.findIndex(x => x.id === element.parentQuestionID);
                this.questionDisplayList[i].childs.push(element);
            }
        });

        this.currentExam.examCriterea.forEach(ec => {
            let calc: GeneralCritereaImpact = this.currentAttempt.generalCritereaImpacts.find(x => x.examCritereaID === ec.id && x.anwserID == null);
            this.critereaDisplayList.push({
                name: ec.name, examCritereaID: ec.id, adjustment: calc.weight, calculated: 0, total: 0
            });
        });

        this.currentQuestion = this.questionDisplayList[this.currentQuestionIndex];
        this.myForm = this.initAnwser(this.currentQuestion);
        this.updateStats(this.currentQuestionIndex);
    }

    initAnwser(currentQuestion: Question2) {
        let a: Anwser = this.currentAttempt.anwsers.find(x => x.questionID === currentQuestion.id);
        //let comp: string;

        console.log("a", a);
        let temp = this._fb.group({
            id: [a.id],
            questionText: [currentQuestion.text],
            questionID: [currentQuestion.id],
            completion: [a.completion],
            total: [a.total],
            adjustment: [a.adjustment],
            note: [a.note],
            max: currentQuestion.max,

            arguments: this._fb.array(this.initArguments(currentQuestion.arguments, a)),
            mistakes: this._fb.array(a.mistakes),

            childs: this._fb.array([])
        });

        if (currentQuestion.childs != null) {
            currentQuestion.childs.forEach(element => {
                (<FormArray>temp.controls.childs).push(this.initAnwser(element));
            });
        }
        console.log("temp", temp);
        return temp;
    }

    initArguments(args: Argument[], a: Anwser) {
        let arr: any[] = [];
        let temp: any, b: boolean = false, s: number, m: Mistake;
        console.log("aergs", args);

        args.forEach(element => {
            b = false;
            s = element.maxMistakeWeight / 2;
            m = a.mistakes.find(x => x.argumentID === element.id)
            if (m != null) {
                b = true;
                s = element.maxMistakeWeight - (m.adjustedWeight * element.maxMistakeWeight) / element.defaultWeight;
            }
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
                variableVal: [s],

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
        this.myForm = this.initAnwser(this.currentQuestion);
        this.updateStats(this.currentQuestionIndex);
    }

    changeCompletion(id: number, completion: string) {
        let i: number = this.currentAttempt.anwsers.findIndex(x => x.id === id);
        let a: Anwser = this.currentAttempt.anwsers[i];
        this.anwserService.updateCompletion(a, completion).subscribe(data => {
            //this.updateStats(id);
            this.currentAttempt.anwsers[i] = data;
            this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                this.currentAttempt = data;
                this.updateStats(i);
            });
        });
    }

    changeSlider(value: any, argID: number, questionID: number) {
        console.log("value", value, "argument", argID, "question", questionID);

        let argument = this.currentExam.questions.find(x => x.id === questionID).arguments.find(x => x.id === argID);
        let i = this.currentAttempt.anwsers.findIndex(x => x.questionID === questionID);
        let index = this.currentAttempt.anwsers[i].mistakes.findIndex(x => x.argumentID === argID);

        console.log("argument.maxMistakeWeight", argument.maxMistakeWeight, "argument.minMistakeWeight", argument.minMistakeWeight);
        this.currentAttempt.anwsers[i].mistakes[index].adjustedWeight = Math.round(argument.defaultWeight * ((argument.maxMistakeWeight - value + argument.minMistakeWeight) / argument.maxMistakeWeight));
        this.updateStats(i);
        console.log("curr", this.currentAttempt);
        this.mistakeService.update(this.currentAttempt.anwsers[i].mistakes[index]).subscribe(res => {
            this.currentAttempt.anwsers[i].mistakes[index] = res;

            this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                this.currentAttempt = data;
                console.log("after", this.currentAttempt);
            });
        });

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
            let weight = argument.defaultWeight / (1 + +argument.variable);
            let newMistatake: Mistake = {
                id: null,
                adjustedWeight: weight,

                argumentID: argID,
                anwserID: this.currentAttempt.anwsers[anwserIndex].id
            };

            //add to the server
            this.mistakeService.create(newMistatake).subscribe(data => {
                newMistatake.id = data.id;
                this.currentAttempt.anwsers[anwserIndex].mistakes.push(newMistatake);
                (<FormArray>this.myForm.controls['mistakes']).push(this._fb.group(data));

                //add all of the criterea impacts
                let criterea: GeneralCritereaImpact[] = [];
                let gc: any;
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

                    this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                        this.currentAttempt = data;
                        this.myForm.value.total = this.currentAttempt.anwsers[anwserIndex].total;
                        console.log("data attempt", data);
                        this.loading = false;
                        this.updateStats(qindex);
                    });/**/
                });

            });
        }
        //remove mistake
        else {

            let m = this.currentAttempt.anwsers[anwserIndex].mistakes.find(x => x.argumentID === argID);
            this.mistakeService.delete(m.id).subscribe(res => {

                let mi = this.currentAttempt.anwsers[anwserIndex].mistakes.findIndex(x => x.argumentID === argID);
                for (var i = this.currentAttempt.generalCritereaImpacts.length - 1; i >= 0; i--) {
                    if (this.currentAttempt.generalCritereaImpacts[i].anwserID === m.id) {
                        this.currentAttempt.generalCritereaImpacts.splice(i, 1);
                    }
                }
                this.currentAttempt.anwsers[anwserIndex].mistakes.splice(mi, 1);

                this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                    this.currentAttempt = data;
                    this.myForm.value.total = this.currentAttempt.anwsers[anwserIndex].total;
                    this.updateStats(qindex);
                });
                //remove general criterea
            });
        }

        console.log("current", this.currentAttempt);

    }

    /**Adjusts a justification to a certian level
     * @param to 
     * @param i 
     */
    adjustImpact(to: number, i: number) {
        console.log(to, i);
        if (this.critereaDisplayList[i].calculated + (+to) > 0) { to = this.critereaDisplayList[i].calculated * -1; }
        this.critereaDisplayList[i].adjustment = +to;
        this.critereaDisplayList[i].total = this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;

        let index = this.currentAttempt.generalCritereaImpacts.findIndex(g => g.anwserID == null && g.examCritereaID == this.critereaDisplayList[i].examCritereaID)
        this.currentAttempt.generalCritereaImpacts[index].weight = +to;
        this.generalCritereaImpactService.update(this.currentAttempt.generalCritereaImpacts[index]).subscribe(data => {
            console.log(data);
        });

    }

    impactChnaged(to: number, i: number) {

        if (this.critereaDisplayList[i].calculated + (+to) > 0) { to = this.critereaDisplayList[i].calculated * -1; }
        console.log("change", to, i);
        this.critereaDisplayList[i].adjustment = +to;
    }

    updateStats(anwserIndex?: number) {
        //calculate and push to server
        if (anwserIndex != undefined) {
            /*this.currentAttempt.anwsers[anwserIndex].total = this.currentAttempt.anwsers[anwserIndex].;
            this.currentAttempt.anwsers[anwserIndex].mistakes.map(x => this.currentAttempt.anwsers[anwserIndex].total -= x.adjustedWeight);
            this.currentAttempt.anwsers[anwserIndex].total += this.currentAttempt.anwsers[anwserIndex].adjustment;*/

            if (this.myForm.value.id == this.currentAttempt.anwsers[anwserIndex].id) {
                this.myForm.value.total = this.currentAttempt.anwsers[anwserIndex].total;
            }
            else if (this.myForm.value.childs != null) {
                for (var y = 0; y < this.myForm.value.childs.length; y++) {
                    if (this.myForm.value.childs[y].id == this.currentAttempt.anwsers[anwserIndex].id) {
                        this.myForm.value.childs[y].total = this.currentAttempt.anwsers[anwserIndex].total;
                    }
                }
            }
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
                if (y.examCritereaID == element.examCritereaID && y.anwserID != null)
                    sum += y.weight
            });

            // console.log("sum", sum, "element", element);
            this.critereaDisplayList[i].calculated = sum;
            this.critereaDisplayList[i].total = this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;
        }
    }

    updateAdjustment(anwserID: number, e: any) {
        console.log("update adjustment", e);
        let i = this.currentAttempt.anwsers.findIndex(x => x.id === anwserID);

        if (this.currentAttempt.anwsers[i].adjustment != +e.target.value) {
            this.currentAttempt.anwsers[i].adjustment = +e.target.value;
            this.currentAttempt.anwsers[i].total += +e.target.value;

            this.anwserService.update(this.currentAttempt.anwsers[i]).subscribe(res => {
                this.currentAttempt.anwsers[i] = res;

                this.examAttemptService.update(this.currentAttempt).subscribe(data => {
                    this.currentAttempt = data;
                    this.updateStats(i);

                });
            });

        }
    }

    changedAdjustment(anwserID: number, e: any) {
        console.log("change adjustment", e);
        let i = this.currentAttempt.anwsers.findIndex(x => x.id === anwserID);
        let max = this.currentExam.questions.find(x => x.id == this.currentAttempt.anwsers[i].questionID).max;
        if (this.myForm.value.adjustment + this.currentAttempt.anwsers[i].total > max) {

            this.myForm.value.adjustment = max - this.myForm.value.total;
            this.myForm.value.total = max;
        }
    }


    changedNote(anwserID: number, e: any) {
        console.log("note change");
        let i = this.currentAttempt.anwsers.findIndex(x => x.id === anwserID);
        this.currentAttempt.anwsers[i].note = e.target.value;
        this.anwserService.update(this.currentAttempt.anwsers[i]).subscribe(data => {
            this.currentAttempt.anwsers[i] = data;
        });
    }

}