import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TodoItem } from '../todolist.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {

  @Input() data! : TodoItem;
  @Output() update = new EventEmitter<Partial<TodoItem>>();
  @Output() remove = new EventEmitter<TodoItem>();

  private _isEditing = false;

  get isEditing():boolean {return this._isEditing}
  set isEditing(e:boolean){
    this._isEditing = e;
  }
  constructor() { }

  ngOnInit(): void {
  }

  changeLabel(label:string): void{
    this.update.emit({label});
    this.isEditing = false;
  }

}
