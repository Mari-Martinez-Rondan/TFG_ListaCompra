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
  /**
   * Generic GET to a backend path. `path` should include leading slash, e.g. '/data' or '/auth/me'
   */
  getData(path: string, params?: HttpParams): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { params, withCredentials: true });
    // withCredentials: true se usa si el backend usa cookies para la autenticación CORS
  }

  /**
   * Generic POST to a backend path. Example: postData('/auth/login', credentials)
   */
  postData(path: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, data, { withCredentials: true });
  }

  /**
   * Generic PUT to a backend path.
   */
  putData(path: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${path}`, data, { withCredentials: true });
  }

  /**
   * Generic DELETE to a backend path.
   */
  deleteData(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`, { withCredentials: true });
  }
}
