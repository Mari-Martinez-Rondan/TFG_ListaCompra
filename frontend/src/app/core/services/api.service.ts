import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getData(path: string, params?: HttpParams): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { params});
  }

  postData(path: string, data: any, options?: any): Observable<any> {
    // options can include HttpClient options such as { responseType: 'text' }
    return this.http.post(`${this.apiUrl}${path}`, data, options);
  }


  putData(path: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${path}`, data);
  }

  deleteData(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`);
  }
}
