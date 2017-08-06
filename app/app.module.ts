import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { CourseComponent, CourseCreateComponent, CourseEditComponent } from './course/index';
import { HeaderComponent } from "./header/header.component";
import { ExamComponent } from './exam/exam.component';
import { ExamCreateComponent } from './exam/create/exam-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TopicComponent } from './course/create/topic.component';
import { CourseService } from './_services/course.service';
import { GeneralCritereaComponent } from './exam/create/generealCriterea.component';
import { AdviceCritereaComponent } from './exam/create/adviceCriterea.component';
import { ExamService } from './_services/exam.service';
import { QuestionService } from './_services/question.service';
import { ExamQuestionsComponent } from './exam/create/questions/exam-questions.component';
import { QestionArgumentComponent } from './exam/create/questions/question-argument.component';
import { ExamEvaluatorComponent } from './exam/create/evaluators/exam-evaluator.component';
import { TopicService } from './_services/topic.service';
import { CritereaComponent } from './criterea/criterea.component';
import { Grade } from './_models/exam';
import { GradeService } from './_services/grade.service';
import { GeneralCritereaService } from './_services/criterea.service';
import { StateService } from './_services/state.service';
import { CritereaFormComponent } from './criterea/criterea-form.component';
import { ExamDataTransferService } from './_services/exam-datatransfer.service';
import { CensorService } from './_services/censor.service';
import { ExamAttemptListComponent } from './ExamAttempt/examAttempt-list';
import { ExamAttemptDataTransferService } from './_services/examAttempt-datatransfer.service';
import { ExamAttemptService } from './_services/examAttempt.service';
import { ExamAttemptEditComponent } from './ExamAttempt/edit/examAttempt-edit.component';
import { MistakeService } from './_services/mistake.service';
import { ExamAttemptArgumentComponent } from './ExamAttempt/edit/examAttempt-argument.component';
import { GeneralCritereaImpactService } from './_services/generalCritereaImpact.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        CourseComponent,
        CourseCreateComponent,
        CourseEditComponent,
        ExamComponent,
        ExamCreateComponent,
        GeneralCritereaComponent,
        CritereaFormComponent,
        AdviceCritereaComponent,
        ExamQuestionsComponent,
        QestionArgumentComponent,
        ExamEvaluatorComponent,
        TopicComponent,
        CritereaComponent,
        HeaderComponent,
        ExamAttemptListComponent,
        ExamAttemptEditComponent,
        ExamAttemptArgumentComponent
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        CourseService,
        TopicService,
        ExamService,
        QuestionService,
        GradeService,
        GeneralCritereaService,
        StateService,
        ExamDataTransferService,
        CensorService,
        ExamAttemptDataTransferService,
        ExamAttemptService,
        MistakeService,
        GeneralCritereaImpactService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }