import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  // Método para solicitud GET
  getData(path: string, params?: HttpParams): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { params});
  }

  // Método para solicitud POST
  postData(path: string, data: any, options?: any): Observable<any> {
    // options puede incluir headers, params, etc.
    return this.http.post(`${this.apiUrl}${path}`, data, {responseType: 'text' as 'json'});
  }

  // Método para solicitud PUT
  putData(path: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${path}`, data);
  }

  // Método para solicitud DELETE
  deleteData(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`);
  }
}
