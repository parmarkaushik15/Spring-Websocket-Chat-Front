import { Component, OnInit, AfterViewInit, AfterViewChecked  } from '@angular/core';
import { Router }  from '@angular/router';  
import { StompService } from 'ng2-stomp-service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { MessageService } from '../service/message.service';
import { Observable } from 'rxjs/Observable';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {
  
      headers = {
        'Access-Control-Allow-Methods':'*',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers':'X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding'
      }
      public messages : any[] = [];
      private socket: any;
      public stomp : any;
      public selectedToUser : any = {};
      private _prevChatHeight: number = 0;
      public users : any[] = [];
      public currentUser : any = {
 
        'username':'kaushik'
      };
      public message = {
        'messageContent':'',
        'messageFrom':'',
        'messageTo':'',
        'messageType':'text'
      }
      messageArea :any;
      
      constructor(private _router: Router,private _messageService: MessageService,private _cookieService:CookieService) {
        this.currentUser = JSON.parse(this._cookieService.get("user"));
        console.log(this.currentUser);
        this.messages = [];
        this.socket = new SockJS('/api/ws');
        this.stomp = Stomp.over(this.socket);
        this.stomp.connect({}, this.connect, this.onError);    
      }

      selectUser(user:any){
        this.selectedToUser = user;
        this._messageService.getUserMessage(user.userName, this.currentUser.userName).subscribe(data => {
          this.messages = [];
          this.messages = data.content;
          console.log(data);
        })
      }

  public connect = (frame:any) => {
    console.log('Connected: ' + frame);
    this.subscribe('/channel/message', this.addMessage);
    //this.stomp.subscribe('/channel/user', this.userList);
  }

  public subscribe(destination:string, callback:any, headers?:Object){
		headers = headers || {};
		return this.stomp.subscribe(destination, function(response){
			let message = JSON.parse(response.body);
			let headers = response.headers;
			callback(message);
		},headers);
	}

  public sendMessage(){
    this.message.messageFrom = this.currentUser.userName;
    this.message.messageTo = this.selectedToUser.userName;
    this.stomp.send("/app/message/send", {},JSON.stringify(this.message));
    this.message.messageContent = "";
  }

  public getUserMessage(){
    this._messageService.getLastActiveUserMessage(this.currentUser.userName).subscribe(data => {
      this.messages = data.content;
      this.selectedToUser = data.lastactiveuser;
    })
    this._messageService.getAllUser().subscribe(data => {
      this.users = data.content;
    })
  }

  ngAfterViewInit() {
    this.messageArea = document.querySelector("#messageArea");
  }
  public ngAfterViewChecked(): void {
    if ( this._canScrollDown() ) {
        this.scrollDown();
    }       
  }
  private _canScrollDown(): boolean {
    var can = (this._prevChatHeight != this.messageArea.scrollHeight);
    this._prevChatHeight = this.messageArea.scrollHeight;
      return can;
  }

  public scrollDown(): void {
      this.messageArea.scrollTop = this.messageArea.scrollHeight;
  }  

  public onError = (error: string ) => {
    console.log('Error: ' + error);
  }

  public addMessage = (msg) => {
    this.messages.push(msg);
  }
  public userList(payload:any){
     console.log('Connected: user successfully'+payload);
  }

  ngOnInit() {
    this.getUserMessage()
  }

}
