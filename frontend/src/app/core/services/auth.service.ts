import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  login(credentials: { usuario: string; password: string }): Observable<any> {
    return this.apiService.postData('/auth/login', credentials).pipe(
      tap(response => {
        // Handle successful login
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.postData('/auth/logout', {}).pipe(
      tap(response => {
        // Handle successful logout
      })
    );
  }
  
  register(data: { usuario: string; email: string; password: string }): Observable<any> {
    return this.apiService.postData('/auth/register', data).pipe(
      tap(response => {
        // Handle successful registration
      })
    );
  }
   
  }