import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  baseUrl = environment.baseURL;

  constructor(private httpClient: HttpClient) { }

  protected get(url: string): Observable<any>{
    return this.httpClient.get(this.baseUrl + url);
  }

  protected postMultipartFile(url : string, formData : FormData) : Observable<any>{
    return this.httpClient.post(this.baseUrl + url, formData);
  }
}
