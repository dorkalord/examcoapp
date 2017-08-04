import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'generalCriterea',
    templateUrl: 'generalCriterea.component.html',
})
export class GeneralCritereaComponent {
    @Input('group')
    public generalCriterea: FormGroup;

    ngOnInit()
    {
        
    }
    constructor(){

    }
}