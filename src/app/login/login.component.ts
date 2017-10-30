import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';  
import { Observable } from 'rxjs/Observable';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  userlogin:any = {
    "userName":"",
    "userPassword":""
  }

  constructor(private _router: Router,private _cookieService:CookieService, private _user:UserService) { }
  ngOnInit() {
  }

  login(){
    this._user.login(this.userlogin).subscribe(data => {
      if(data.status == 200){
        this._cookieService.put("user",JSON.stringify(data.record));
        this._router.navigate(['/home']); 
      }
    })
  }



}
