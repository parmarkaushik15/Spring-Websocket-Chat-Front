import { Injectable } from '@angular/core';
import { Http , Response, Headers } from '@angular/http'; 
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/do';

@Injectable()
export class UserService {

  constructor(private _http: Http) { }
  public login(user:any){
    const headers = new Headers({'Content-Type': 'application/json'});
    return this._http.post("/api/user/login", JSON.stringify(user),{ headers: headers }).map(data => {
         data.json();
         return data.json();
     }); 
  }
}
