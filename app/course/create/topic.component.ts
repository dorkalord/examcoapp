import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'topic',
    templateUrl: 'topic.component.html',
})
export class TopicComponent {
    @Input('group')
    public topicForm: FormGroup;
    @Input('topics')
    public topics:any;

    ngOnInit()
    {
        
    }
    constructor(){

    }
}