import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subject, map } from 'rxjs';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoItem, TodoList, TodolistService } from '../todolist.service';

type FctFilter = (item: TodoItem) => boolean;

export interface TodoListPlus extends TodoList{
  allDone : boolean;
  filter: FctFilter;
  remaining : number;
  displayItems : TodoItem[];

}
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  //readonly todolistObs : Observable<TodoListPlus>;

  readonly fAll: FctFilter = () => true;
  private subject = new BehaviorSubject<FctFilter>(this.fAll);
  readonly obsFilter : Observable<FctFilter> = this.subject.asObservable();

  readonly fCompleted: FctFilter = (it) => it.isDone;

  readonly fActive : FctFilter = (it) => !it.isDone;

  readonly tdlObs: Observable<TodoListPlus>;

  constructor(private tds: TodolistService) {
    this.tdlObs = combineLatest([tds.observable, this.obsFilter ]).pipe(
      map( ([L, f]) => ({
        ...L,
        filter: f,
        remaining: L.items.reduce( (nb, item) => !item.isDone ? nb + 1 : nb, 0),
        displayItems: L.items.filter(f)
      })),
      map( inter => ({
        ...inter,
        allDone: inter.remaining === 0
      }))
    );
  }

  ngOnInit(): void {
  }

  create(...labels: readonly string[]): void {
    this.tds.create(...labels);
  }

  delete(...items: readonly TodoItem[]): void {
    this.tds.delete(...items);
  }

  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): void {
    this.tds.update(data, ...items);
  }

  trackById(i:number, e:TodoItem):number{
    return e.id;
  }

  filterAll():void{
    this.subject.next(this.fAll);
  }

  filterCompleted():void{
    this.subject.next(this.fCompleted);
  }

  filterActive():void{
    this.subject.next(this.fActive);
  }

  supprCoches():void{
    this.tds.supprCoches();
  }

  updateAllDone(done: boolean, L: readonly TodoItem[]){
    this.update({isDone: done}, ...L);
  }


}
