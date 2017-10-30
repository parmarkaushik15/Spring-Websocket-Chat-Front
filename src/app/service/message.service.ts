import { Injectable } from '@angular/core';
import { Http , Response, Headers } from '@angular/http'; 
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/do';

@Injectable()
export class MessageService {

  constructor(private _http: Http) { }
  public getLastActiveUserMessage(user:any){
    return this._http.get("/api/message/getlastactiveuser/"+user).map(data => {
        data.json();
        console.log(data.json());
        return data.json();
    }); 
  }


  public getUserMessage(to:any, from:any){
    return this._http.get("/api/message/get/"+to+"/"+from).map(data => {
        data.json();
        console.log(data.json());
        return data.json();
    }); 
  }

  public getAllUser(){
    return this._http.get("/api/user/all").map(data => {
        data.json();
        console.log(data.json());
        return data.json();
    }); 
  }
}
