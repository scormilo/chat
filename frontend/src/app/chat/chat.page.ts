import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { IonContent } from '@ionic/angular';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

// implementamos varios metodos en el onInit como son el de cuando se ingresa a la sala
// de chat automaticamente baje al ultimo mensaje enviado a pesar de su historial
// tambien se agrega un metodo para poder adjuntar imagenes en el chat
// y el metodo de logout

export class ChatPage implements OnInit {
  @ViewChild('scrollArea') content: IonContent;
  messageList: any[] = [];
  chatMessage: string = "";
  attachment:  File  =  null;
  constructor(private router: Router, private chatService: ChatService, private authService: AuthService) { }


  ngOnInit() {
    this.chatService.getMessages().subscribe(messages => {
      this.messageList = messages;
      this.scrollToBottom();
    });
  }

  sendMessage() {
    this.chatService.sendMessage({ text: this.chatMessage, attachment: this.attachment }).then(() => {
      this.chatMessage = "";
      this.attachment = null;
      this.scrollToBottom();
    });
  }
  async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  get typingUsers(){
    return this.chatService.getTypingUsers();
  }
  onKeydown(e){
    this.chatService.sendTypingEvent();
  }
  onKeyup(e){
    this.chatService.sendTypingEvent();
  }
  attachFile(e){
    if (e.target.files.length == 0) {
      return
    }
    let file: File = e.target.files[0];
    this.attachment = file;
  }
  scrollToBottom() {

    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 1000);

  }

}
