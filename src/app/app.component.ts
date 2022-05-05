import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { TodolistService, TodoItem, TodoList } from './todolist.service'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';

  readonly todoListObs: Observable<TodoList>;


  constructor(public todoListService: TodolistService, public auth: AngularFireAuth){
    this.todoListObs = todoListService.observable;
  }
  
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }
  ngOnInit(){
  }

  onSubmit(data: string){
    console.log(data);
    this.todoListService.create(data);
  }

  trackById(i: number, e: TodoItem): number{
    return e.id;
  }
  updateDone(data: boolean,item:TodoItem){
    this.todoListService = this.todoListService.update({isDone:data},item)
  }

  updateLabel(data: string,item:TodoItem){
    this.todoListService = this.todoListService.update({label:data},item)
  }
  delete(data:TodoItem){
    this.todoListService.delete(data)
  }
  undo(){
    this.todoListService.undo()
  }
  redo(){
    this.todoListService.redo()
  }
}
