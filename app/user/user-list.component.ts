import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { CourseComponent } from '../course/course.component';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../_services/alert.service';
import { Router } from '@angular/router';
import { Role } from '../_models/role';
declare var jQuery: any;
@Component({
    moduleId: module.id,
    templateUrl: 'user-list.component.html'
})

export class UserListComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    allusers: User[] = [];
    loading: boolean = false;
    model: any = {};
    editModel: any = {};

    @ViewChild('myModal') myModal: ElementRef;
    @ViewChild('editModal') editModal: ElementRef;


    constructor(private userService: UserService,
        private _fb: FormBuilder,
        private alertService: AlertService,
        private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }
    update(query: string) {
        this.users = this.allusers;
        this.users = this.users.filter(x => x.username.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    editUser(i: number) {
        this.editModel = this.users[i];
        this.editModel.password = "";
    }
    remove(i: number) {
        this.loading = true;
        this.userService.delete(this.users[i].id).subscribe(
            res => { this.loadAllUsers() },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            }
        );
    }

    import() { }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; this.allusers = users; });
    }

    save() {
        let temp: User = {
            id: this.editModel.id,
            name: this.editModel.name,
            email: this.editModel.email,
            username: this.editModel.username,
            password: this.editModel.password,
            roleID: this.editModel.roleID
        }
        this.loading = true;
        this.userService.update(temp).subscribe(
            data => {
                this.alertService.success('Update successful', true);
                this.loadAllUsers();
                this.loading = false;
                jQuery(this.editModal.nativeElement).modal('hide');
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            }
        );
    }

    register() {
        this.loading = true;
        this.model.roleID = 4;
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.loading = false;
                jQuery(this.myModal.nativeElement).modal('hide');
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            });

    }


}