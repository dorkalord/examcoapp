﻿import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { CourseComponent, CourseCreateComponent, CourseEditComponent } from "./course/index";
import { ExamComponent } from './exam/exam.component';
import { ExamCreateComponent } from './exam/create/exam-create.component';
import { ExamQuestionsComponent } from './exam/create/questions/exam-questions.component';
import { ExamEvaluatorComponent } from './exam/create/evaluators/exam-evaluator.component';
import { CritereaComponent } from './criterea/criterea.component';
import { ExamAttemptListComponent } from './ExamAttempt/examAttempt-list';
import { ExamAttemptEditComponent } from './ExamAttempt/edit/examAttempt-edit.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'course', component: CourseComponent, canActivate: [AuthGuard]  },
    { path: 'course/create', component: CourseCreateComponent, canActivate: [AuthGuard]  },
    { path: 'course/edit/:id', component: CourseEditComponent, canActivate: [AuthGuard]  },

    { path: 'criterea', component: CritereaComponent, canActivate: [AuthGuard]  },

    { path: 'exam', component: ExamComponent, canActivate: [AuthGuard]  },
    { path: 'exam/create', component: ExamCreateComponent, canActivate: [AuthGuard]  },
    { path: 'exam/create/:id/question', component: ExamQuestionsComponent, canActivate: [AuthGuard]  },
    { path: 'exam/create/:id/evaluator', component: ExamEvaluatorComponent, canActivate: [AuthGuard]  },

    { path: 'attempts/:examID/censor/:censorID', component: ExamAttemptListComponent, canActivate: [AuthGuard]  },
    { path: 'attempts/:examID/edit', component: ExamAttemptEditComponent, canActivate: [AuthGuard]  },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);

