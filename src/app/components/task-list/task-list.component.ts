import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Task Manager</h2>
      
      <div class="add-task">
        <input
          type="text"
          [(ngModel)]="newTaskTitle"
          placeholder="New task..."
          (keyup.enter)="addTask()"
        >
        <button (click)="addTask()">Add Task</button>
      </div>

      <ul class="task-list">
        <li *ngFor="let task of tasks">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="toggleTask(task)"
          >
          <span [class.completed]="task.completed">{{ task.title }}</span>
          <button (click)="deleteTask(task.id!)">Delete</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    .add-task {
      margin-bottom: 20px;
    }
    .add-task input {
      padding: 8px;
      margin-right: 10px;
      width: 60%;
    }
    .add-task button {
      padding: 8px 16px;
    }
    .task-list {
      list-style: none;
      padding: 0;
    }
    .task-list li {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .task-list li input[type="checkbox"] {
      margin-right: 10px;
    }
    .completed {
      text-decoration: line-through;
      color: #888;
    }
    button {
      margin-left: auto;
      padding: 4px 8px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        title: this.newTaskTitle,
        completed: false
      };
      this.taskService.addTask(newTask).subscribe(() => {
        this.loadTasks();
        this.newTaskTitle = '';
      });
    }
  }

  toggleTask(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}