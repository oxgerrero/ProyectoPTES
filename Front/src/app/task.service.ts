import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Task {
  id?: number; // ID opcional, si es una tarea nueva no tendrá ID
  name: string;
  estado: boolean;
}

export interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.URL_API}/tasks`;
  private User = environment.User;

  constructor(private http: HttpClient) {}

  login(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.URL_API}/login`, { "username":this.User });
  
  }

  createTask(task: Task): Observable<Task> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<Task>(this.apiUrl, task, { headers });
  }

  getTasks(): Observable<Task[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<Task[]>(this.apiUrl, { headers });
  }

  updateTask(task: Task): Observable<Task> {
    const headers = this.createAuthorizationHeader();
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers });
  }
  
  deleteTask(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtén el token de localStorage
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`); // Añade el token a las cabeceras
    }

    return headers;
  }
}
