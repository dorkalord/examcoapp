import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Course } from '../_models/course';
import { CourseService } from '../_services/course.service';
import { ExamAttempt } from '../_models/examAttempt';
import { ExamAttemptService } from '../_services/examAttempt.service';
import { ExamService } from '../_services/exam.service';
import { ExamAttemptDataTransferService } from '../_services/examAttempt-datatransfer.service';
import { Router } from '@angular/router';
import { Exam } from '../_models/exam';

@Component({
    moduleId: module.id,
    selector: "examAttempt-list",
    templateUrl: 'examAttempt-list.html'

})

export class ExamAttemptListComponent implements OnInit {
    currentUser: User;
    loading: boolean;
    currentExam: Exam;
    examAttemptList: ExamAttempt[];

    constructor(private userService: UserService,
        private examAttemptService: ExamAttemptService,
        private examService: ExamService,
        private router: Router,
        private examAttemptDataTransferService: ExamAttemptDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loading = false;
        this.examAttemptList = this.examAttemptDataTransferService.examAttempts;
        this.currentExam = this.examAttemptDataTransferService.currentExam;
    }

    ngOnInit() {

    }

    edit(attemptID: number) {
        this.loading = true;
        this.examService.getByIdForCensoring(this.currentExam.id).subscribe(data => {
            
            this.examAttemptDataTransferService.currentExam = data;
            this.examAttemptService.getById(attemptID).subscribe(res => {
                this.examAttemptDataTransferService.currentExamAttempt = res;
                
                this.router.navigateByUrl('/attempts/' + res.id + '/edit');
            });
        });
    }

    create() {
        this.loading = true;
        let attempt: ExamAttempt = new ExamAttempt();
         console.log("attempt", this.examAttemptDataTransferService.currentExam);
        attempt.examID = this.examAttemptDataTransferService.currentExam.id;
        attempt.censorID = this.examAttemptDataTransferService.currentCensor.id;
        attempt.studentID = 4;

        console.log("attempt", attempt);
        this.examAttemptService.create(attempt).subscribe(data => {
            console.log("new attempt", data);
            this.edit(data.id);
        });
        console.log(attempt.censorshipDate);
    }

    remove(id: number) {
        alert("not implemented jet");
    }


}