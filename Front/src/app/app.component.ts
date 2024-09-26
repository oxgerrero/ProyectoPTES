import { Component, OnInit,  Inject, PLATFORM_ID } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Chart } from 'chart.js/auto';

import { TaskService, Task } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatCheckboxModule,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  newTask: string = "";
  filter="";

  public chartData: number[]=[0,0];
  public chartLabels: string[] = ['To Do', 'Done'];

  private myChart: Chart | null = null;

  tasksOriginal: Task[] = [];
  taskMostrar=this.tasksOriginal;

  deleteTask(task: any) {
    this.taskService.deleteTask(task.id).subscribe(
      (data) => {
        this.loadTasks();
        this.applyFilter();
      },
      (error) => {
        console.error('Error al eliminar la tarea', error);
      }
    );
  }

  addTask() {
    if(this.newTask!=""){
      let task={id:0, name: this.newTask, estado: false };
      this.taskService.createTask(task).subscribe(
        (taskO) => {
          this.loadTasks();
          this.applyFilter();
        },
        (error) => {
          console.error('Error al crear la tarea', error);
        }
      );
    }else{
      alert("La tarea debe tener un nombre")
    }
  }
  
  applyFilter(){
    this.currentPage = 0;
    if(this.filter==""){
      this.taskMostrar = this.tasksOriginal;
    }else{
      this.taskMostrar = this.tasksOriginal.filter(x=>x.estado ==  (this.filter=="1"));
    }
    this.updateChart();
  }
  changeState(task: any){
    this.taskService.updateTask(task).subscribe(
      (updatedTask) => {
        this.loadTasks();
        this.applyFilter();
      },
      (error) => {
        console.error('Error al actualizar la tarea', error);
      }
    );
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.login();
      this.loadTasks();
      this.createChart();
      this.applyFilter();
    }
  }
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private taskService: TaskService) {
    this.applyFilter();
  }

  createChart(){
    let done=this.taskMostrar.filter(task => task.estado).length;
    let toDo=this.taskMostrar.length - done;
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart("ctx", {
      type: 'bar',
      data: {
        labels: ['To Do', 'Done'],
        datasets: [{
          label: '# of task',
          data: [toDo, done],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChart() {
    this.createChart();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data) => {
        console.log(data)
        this.tasksOriginal = data;
        this.applyFilter();
      },
      (error) => {
        console.error('Error al cargar las tareas', error);
      }
    );
  }
  login(): void {
    this.taskService.login().subscribe(
      (response) => {
        localStorage.setItem('authToken', response.access_token);
        console.log('Login successful!', response);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  pageSize = 5;
  currentPage = 0;

  get paginatedTasks() {
    const startIndex = this.currentPage * this.pageSize;
    return this.taskMostrar.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.taskMostrar.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
