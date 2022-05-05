import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HistoryService } from './history.service';

export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}

let idItem = 0;

@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  private subj = new BehaviorSubject<TodoList>({label: 'L3 MIAGE', items: [] });
  readonly observable = this.subj.asObservable();

  constructor(private historyService: HistoryService<TodoList>) {
    let retrievedTDL = localStorage.getItem("myTodoList")
    if(retrievedTDL!=null && retrievedTDL != "undefined"){
      console.log(retrievedTDL)
      this.subj.next(JSON.parse(retrievedTDL || "{label: 'L3 MIAGE', items: [] }"))
    }
    this.subj.subscribe(()=>{
      localStorage.setItem('myTodoList',JSON.stringify(this.subj.value));
      console.log(localStorage.getItem('myTodoList'))
    })
  }

  create(...labels: readonly string[]): this {
    const L: TodoList = this.subj.value;
    this.subj.next( {
      ...L,
      items: [
        ...L.items,
        ...labels.filter( l => l !== '').map(
            label => ({label, isDone: false, id: idItem++})
          )
      ]
    } );
    this.historyService.push(this.subj.value)
    return this;
  }

  delete(...items: readonly TodoItem[]): this {
    const L = this.subj.value;
    this.subj.next( {
      ...L,
      items: L.items.filter(item => items.indexOf(item) === -1 )
    } );
    this.historyService.push(this.subj.value)
    return this;
  }

  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this {
    if(data.label !== "") {
      const L = this.subj.value;
      this.subj.next( {
        ...L,
        items: L.items.map( item => items.indexOf(item) >= 0 ? {...item, ...data} : item )
      } );

    } else {
      this.delete(...items);
    }

    this.historyService.push(this.subj.value)
    return this;
  }

  undo(){
    this.subj.next(this.historyService.undo())
  }
  redo(){
    this.subj.next(this.historyService.redo())
  }

  supprCoches():void{
    const L = this.subj.value;
    this.subj.next({
      ...L,
      items: L.items.filter(item => !item.isDone)
    })
  }
}
