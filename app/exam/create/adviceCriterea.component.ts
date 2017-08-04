import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'advice',
    templateUrl: 'adviceCriterea.component.html',
})
export class AdviceCritereaComponent {
    @Input('group')
    public advice: FormGroup;
    private currentGrade: string;

    ngOnInit()
    {
        this.currentGrade = this.advice.controls.grade.value;
    }
    constructor(){

    }
}