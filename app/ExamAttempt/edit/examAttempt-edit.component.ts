import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { ExamAttempt, Anwser } from '../../_models/examAttempt';
import { ExamAttemptService } from '../../_services/examAttempt.service';
import { ExamService } from '../../_services/exam.service';
import { ExamAttemptDataTransferService, critereaDisplay } from '../../_services/examAttempt-datatransfer.service';
import { Router } from '@angular/router';
import { Exam, ExamFull, Question2 } from '../../_models/exam';
import { Question, Argument } from '../../_models/question';

@Component({
    moduleId: module.id,
    selector: "examAttempt-edit",
    templateUrl: 'examAttempt-edit.component.html'

})

export class ExamAttemptEditComponent implements OnInit {
    currentUser: User;
    loading: boolean;
    currentExam: ExamFull;
    currentAttempt: ExamAttempt;
    currentQuestion: Question2;
    currentQuestionIndex: number;
    questionDisplayList: Question2[];
    completions: string[];
    critereaDisplayList: critereaDisplay[];

    constructor(private userService: UserService,
        private examAttemptService: ExamAttemptService,
        private examService: ExamService,
        private router: Router,
        private examAttemptDataTransferService: ExamAttemptDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        /*this.loading = false;

        this.currentExam = this.examAttemptDataTransferService.currentExam;
        this.currentAttempt = this.examAttemptDataTransferService.currentExamAttempt;
        console.log("big exam", this.currentExam.questions);*/

        this.completions = [];

        this.currentExam = {
            "id": 2,
            "date": "2017-01-01T10:30:00",
            "language": "English",
            "status": "Peer censoring",
            "authorID": 1,
            "courseID": 1,
            "stateID": 2,
            "course": {
                "id": 1,
                "name": "Digital nano electronics",
                "code": "INF3400",
                "lecturerID": 1,
                "lecturer": {
                    "id": 1,
                    "username": "admin",
                    "password": null,
                    "name": "Admin",
                    "email": "admin@uio.no",
                    "roleID": 1
                },
                "topics": [
                    {
                        "id": 1,
                        "name": "Microelectronics",
                        "description": "",
                        "courseID": 1,
                        "parrentTopicID": null
                    },
                    {
                        "id": 2,
                        "name": "Digital circuits",
                        "description": "",
                        "courseID": 1,
                        "parrentTopicID": null
                    },
                    {
                        "id": 3,
                        "name": "Sequential circuits",
                        "description": "",
                        "courseID": 1,
                        "parrentTopicID": null
                    },
                    {
                        "id": 4,
                        "name": "Semiconductor technologies",
                        "description": "",
                        "courseID": 1,
                        "parrentTopicID": null
                    }
                ]
            },
            "author": {
                "id": 1,
                "username": "admin",
                "password": null,
                "name": "Admin",
                "email": "admin@uio.no",
                "roleID": 1
            },
            "state": {
                "id": 2,
                "name": "Peer censoring",
                "commands": "['censor']"
            },
            "censors": [
                {
                    "id": 2,
                    "userID": 3,
                    "examID": 2
                }
            ],
            "examCriterea": [
                {
                    "id": 4,
                    "name": "Critical ability",
                    "generalCritereaID": 1,
                    "advices": []
                },
                {
                    "id": 5,
                    "name": "Independence",
                    "generalCritereaID": 2,
                    "advices": []
                },
                {
                    "id": 6,
                    "name": "Pro dissemination",
                    "generalCritereaID": 3,
                    "advices": []
                },
                {
                    "id": 7,
                    "name": "Use of wrong method",
                    "generalCritereaID": 4,
                    "advices": []
                },
                {
                    "id": 8,
                    "name": "Time allocation",
                    "generalCritereaID": 5,
                    "advices": []
                },
                {
                    "id": 9,
                    "name": "Neatness",
                    "generalCritereaID": 6,
                    "advices": []
                }
            ],
            "questions": [
                {
                    "id": 1,
                    "seqencialNumber": 1,
                    "text": "Task 1",
                    "proposedWeight": null,
                    "finalWeight": null,
                    "examID": 2,
                    "parentQuestionID": null,
                    "tags": [],
                    "arguments": [
                        {
                            "id": 1,
                            "advice": "",
                            "text": "Nmos used in the raid",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 40,
                            "parentArgumentID": null,
                            "questionID": 1,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 1,
                                    "severity": 0,
                                    "examCritereaID": 4,
                                    "argumentID": 1
                                },
                                {
                                    "id": 18,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 1
                                },
                                {
                                    "id": 19,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 1
                                },
                                {
                                    "id": 20,
                                    "severity": 0,
                                    "examCritereaID": 7,
                                    "argumentID": 1
                                },
                                {
                                    "id": 21,
                                    "severity": 20,
                                    "examCritereaID": 6,
                                    "argumentID": 1
                                },
                                {
                                    "id": 22,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 1
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "advice": "",
                            "text": "Pmos used in the downfall",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 40,
                            "parentArgumentID": null,
                            "questionID": 1,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 12,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 2
                                },
                                {
                                    "id": 13,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 2
                                },
                                {
                                    "id": 14,
                                    "severity": 7,
                                    "examCritereaID": 7,
                                    "argumentID": 2
                                },
                                {
                                    "id": 15,
                                    "severity": 7,
                                    "examCritereaID": 6,
                                    "argumentID": 2
                                },
                                {
                                    "id": 16,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 2
                                },
                                {
                                    "id": 17,
                                    "severity": 7,
                                    "examCritereaID": 4,
                                    "argumentID": 2
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "advice": "",
                            "text": "Not implemented as a single CMOS port",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 30,
                            "parentArgumentID": null,
                            "questionID": 1,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 6,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 3
                                },
                                {
                                    "id": 7,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 3
                                },
                                {
                                    "id": 8,
                                    "severity": 5,
                                    "examCritereaID": 7,
                                    "argumentID": 3
                                },
                                {
                                    "id": 9,
                                    "severity": 5,
                                    "examCritereaID": 6,
                                    "argumentID": 3
                                },
                                {
                                    "id": 10,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 3
                                },
                                {
                                    "id": 11,
                                    "severity": 5,
                                    "examCritereaID": 4,
                                    "argumentID": 3
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "advice": "",
                            "text": "Degree of error in the expression",
                            "variable": true,
                            "minMistakeText": "Minimum impact",
                            "maxMistakeText": "Big impact",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 40,
                            "parentArgumentID": null,
                            "questionID": 1,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 2,
                                    "severity": 8,
                                    "examCritereaID": 7,
                                    "argumentID": 4
                                },
                                {
                                    "id": 3,
                                    "severity": 0,
                                    "examCritereaID": 6,
                                    "argumentID": 4
                                },
                                {
                                    "id": 4,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 4
                                },
                                {
                                    "id": 5,
                                    "severity": 8,
                                    "examCritereaID": 4,
                                    "argumentID": 4
                                },
                                {
                                    "id": 23,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 4
                                },
                                {
                                    "id": 24,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 4
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "seqencialNumber": 2,
                    "text": "Task 2",
                    "proposedWeight": null,
                    "finalWeight": null,
                    "examID": 2,
                    "parentQuestionID": null,
                    "tags": [],
                    "arguments": [
                        {
                            "id": 5,
                            "advice": "",
                            "text": "The pull down and drop are not matched",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 30,
                            "parentArgumentID": null,
                            "questionID": 2,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 25,
                                    "severity": 8,
                                    "examCritereaID": 4,
                                    "argumentID": 5
                                },
                                {
                                    "id": 26,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 5
                                },
                                {
                                    "id": 27,
                                    "severity": 0,
                                    "examCritereaID": 6,
                                    "argumentID": 5
                                },
                                {
                                    "id": 28,
                                    "severity": 8,
                                    "examCritereaID": 7,
                                    "argumentID": 5
                                },
                                {
                                    "id": 29,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 5
                                },
                                {
                                    "id": 30,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 5
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 3,
                    "seqencialNumber": 3,
                    "text": "Worst case",
                    "proposedWeight": null,
                    "finalWeight": null,
                    "examID": 2,
                    "parentQuestionID": 2,
                    "tags": [],
                    "arguments": [
                        {
                            "id": 6,
                            "advice": "",
                            "text": "Wrong network in the pull out",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 40,
                            "parentArgumentID": null,
                            "questionID": 3,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 31,
                                    "severity": 0,
                                    "examCritereaID": 4,
                                    "argumentID": 6
                                },
                                {
                                    "id": 32,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 6
                                },
                                {
                                    "id": 33,
                                    "severity": 0,
                                    "examCritereaID": 6,
                                    "argumentID": 6
                                },
                                {
                                    "id": 34,
                                    "severity": 15,
                                    "examCritereaID": 7,
                                    "argumentID": 6
                                },
                                {
                                    "id": 35,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 6
                                },
                                {
                                    "id": 36,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 6
                                }
                            ]
                        },
                        {
                            "id": 7,
                            "advice": "",
                            "text": "Wrong network in the downfall",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 10,
                            "parentArgumentID": null,
                            "questionID": 3,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 37,
                                    "severity": 0,
                                    "examCritereaID": 4,
                                    "argumentID": 7
                                },
                                {
                                    "id": 38,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 7
                                },
                                {
                                    "id": 39,
                                    "severity": 0,
                                    "examCritereaID": 6,
                                    "argumentID": 7
                                },
                                {
                                    "id": 40,
                                    "severity": 5,
                                    "examCritereaID": 7,
                                    "argumentID": 7
                                },
                                {
                                    "id": 41,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 7
                                },
                                {
                                    "id": 42,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 7
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 4,
                    "seqencialNumber": 4,
                    "text": "Best case",
                    "proposedWeight": null,
                    "finalWeight": null,
                    "examID": 2,
                    "parentQuestionID": 2,
                    "tags": [],
                    "arguments": [
                        {
                            "id": 8,
                            "advice": "",
                            "text": "Wrong network in the pull out",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 40,
                            "parentArgumentID": null,
                            "questionID": 4,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 43,
                                    "severity": 15,
                                    "examCritereaID": 4,
                                    "argumentID": 8
                                },
                                {
                                    "id": 44,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 8
                                },
                                {
                                    "id": 45,
                                    "severity": 0,
                                    "examCritereaID": 6,
                                    "argumentID": 8
                                },
                                {
                                    "id": 46,
                                    "severity": 0,
                                    "examCritereaID": 7,
                                    "argumentID": 8
                                },
                                {
                                    "id": 47,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 8
                                },
                                {
                                    "id": 48,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 8
                                }
                            ]
                        },
                        {
                            "id": 9,
                            "advice": "",
                            "text": "Wrong network in the downfall",
                            "variable": false,
                            "minMistakeText": "",
                            "maxMistakeText": "",
                            "minMistakeWeight": 0,
                            "maxMistakeWeight": 100,
                            "defaultWeight": 10,
                            "parentArgumentID": null,
                            "questionID": 4,
                            "authorID": 1,
                            "argumentCritereas": [
                                {
                                    "id": 49,
                                    "severity": 5,
                                    "examCritereaID": 4,
                                    "argumentID": 9
                                },
                                {
                                    "id": 50,
                                    "severity": 0,
                                    "examCritereaID": 5,
                                    "argumentID": 9
                                },
                                {
                                    "id": 51,
                                    "severity": 0,
                                    "examCritereaID": 6,
                                    "argumentID": 9
                                },
                                {
                                    "id": 52,
                                    "severity": 0,
                                    "examCritereaID": 7,
                                    "argumentID": 9
                                },
                                {
                                    "id": 53,
                                    "severity": 0,
                                    "examCritereaID": 8,
                                    "argumentID": 9
                                },
                                {
                                    "id": 54,
                                    "severity": 0,
                                    "examCritereaID": 9,
                                    "argumentID": 9
                                }
                            ]
                        }
                    ]
                }
            ],
            "grades": []
        };

        this.questionDisplayList = [];
        this.currentAttempt = {
            id: 1,
            total: 0,
            finalTotal: null,
            censorshipDate: null,
            gradingDate: null,

            gradeID: 1,
            examID: 2,
            censorID: 2,
            studentID: 4,

            anwsers: [],
            generalCritereaImpacts: []
        }

        let temp: Anwser, i: number;
        this.currentExam.questions.forEach(element => {
            temp = new Anwser();
            temp.examAttemtID = 1;
            temp.total = 0;
            temp.questionID = element.id;
            temp.mistakes = [];
            this.currentAttempt.anwsers.push(temp);
            element.childs = [];
            this.completions.push(null);
            if (element.parentQuestionID == null) {
                this.questionDisplayList.push(element);
            }
            else {

                i = this.questionDisplayList.findIndex(x => x.id === element.parentQuestionID);
                this.questionDisplayList[i].childs.push(element);
            }
        });

        this.critereaDisplayList = [];
        this.currentExam.examCriterea.forEach(ec => {
            this.critereaDisplayList.push({
                name: ec.name,
                examCritereaID: ec.id,
                adjustment: 0,
                calculated: 0,
                total:0
            });
        });
        this.currentExam.questions.length
        this.currentQuestionIndex = 0;
    }

    ngOnInit() {
        this.currentQuestion = this.currentExam.questions[this.currentQuestionIndex];
    }

    edit(attemptID: number) {
    }

    create() {
    }

    remove(id: number) {
    }

    moveTo(i: number){
        //push to server
        this.currentQuestionIndex = i;
        this.currentQuestion = this.questionDisplayList[this.currentQuestionIndex];
        
    }

    changeCompletion() {
        let val: number = 0;
        if (this.completions[this.currentQuestionIndex] !== "Blank") val = 100;
        this.currentAttempt.anwsers[this.currentQuestionIndex].total = val;

    }

    changeArg(value: any, argID: number, questionID: number) {
        console.log("value", value, "argument", argID, "question", questionID);
        let question = this.currentExam.questions.find(x => x.id === questionID);
        let argument = question.arguments.find(x => x.id === argID);
        let i = this.currentAttempt.anwsers.findIndex(x => x.questionID === questionID);

        if (value === true) {
            //add mistake, potrebno je tole poslat na bazo zaradi IDjev
            this.currentAttempt.anwsers[i].mistakes.push({
                id: null,
                adjustedWeight: null,

                argumentID: argID,
                anwserID: this.currentAttempt.anwsers[i].id
            });

            argument.argumentCritereas.forEach(ac => {
                this.currentAttempt.generalCritereaImpacts.push({
                    id: null,
                    anwserID: i,
                    examAttemtID: this.currentAttempt.id,
                    examCritereaID: ac.examCritereaID,
                    mistakeID: ac.argumentID,
                    weight: ac.severity
                });
            });

            this.currentAttempt.anwsers[i].total -= argument.defaultWeight;
        }
        else {
            //remove mistake
            let a = this.currentAttempt.anwsers[i].mistakes.findIndex(x => x.argumentID === argID);
            this.currentAttempt.anwsers[i].mistakes.splice(a, 1);
            this.currentAttempt.anwsers[i].total += argument.defaultWeight;
        }
        this.updateStats();
    }

    adjustImpact(by:number, i:number)
    {
        this.critereaDisplayList[i].adjustment = +by;
        console.log(typeof(by), typeof(this.critereaDisplayList[i].adjustment)  );
        this.critereaDisplayList[i].total= this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;
    }


    updateStats(anwserIndex?: number) {
        //calculate and push to server

        this.currentAttempt.total = 0;
        this.currentAttempt.anwsers.map(x => this.currentAttempt.total += x.total);

        let sum: number = 0, index: number = 0;

        for (var i = 0; i < this.critereaDisplayList.length; i++) {
            sum = 0;
            var element = this.critereaDisplayList[i];
            
            this.currentAttempt.generalCritereaImpacts.map(y => { 
                //console.log(y.anwserID, y, element)
            if(y.examCritereaID == element.examCritereaID)
                sum += y.weight
            });
            
            // console.log("sum", sum, "element", element);
            this.critereaDisplayList[i].calculated = sum;
            this.critereaDisplayList[i].total= this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;
        }
    }

}