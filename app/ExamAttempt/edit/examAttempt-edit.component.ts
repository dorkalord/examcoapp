import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { ExamAttempt } from '../../_models/examAttempt';
import { ExamAttemptService } from '../../_services/examAttempt.service';
import { ExamService } from '../../_services/exam.service';
import { ExamAttemptDataTransferService } from '../../_services/examAttempt-datatransfer.service';
import { Router } from '@angular/router';
import { Exam } from '../../_models/exam';

@Component({
    moduleId: module.id,
    selector: "examAttempt-edit",
    templateUrl: 'examAttempt-edit.component.html'

})

export class ExamAttemptEditComponent implements OnInit {
    currentUser: User;
    loading: boolean;
    currentExam: Exam;
    currentAttempt: ExamAttempt;

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

    }

    ngOnInit() {
    }

    edit(attemptID: number) {
    }

    create() {
    }

    remove(id: number) {
    }


}