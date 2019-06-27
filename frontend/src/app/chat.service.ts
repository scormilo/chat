import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

// en esta pagina permitimos que la app se conecte a la instancia de chatkit 
// debemos enviar el id del cuarto y el id de la instancia, tambien podemos encontrar
// los metodos del chat como lo es cuando estan escribiendo, o se han detenido de escribir
// si esta en linea, poder mandar mensajes etc
//

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  AUTH_URL = 'http://localhost:3000/token';
  INSTANCE_LOCATOR = 'v1:us1:b278c86f-92ad-44ac-82df-5cdaa8d334d7';
  GENERAL_ROOM_ID = '19432890';
  GENERAL_ROOM_INDEX = 0;

  chatManager: ChatManager;
  currentUser;
  messages = [];
  typingUsers  = [];


  usersSubject = new BehaviorSubject([]);
  messagesSubject = new BehaviorSubject([]);

  constructor() { }

  async connectToChatkit(userId: string) {
    this.chatManager = new ChatManager({
      instanceLocator: this.INSTANCE_LOCATOR,
      userId: userId,
      tokenProvider: new TokenProvider({ url: this.AUTH_URL })
    })

    this.currentUser = await this.chatManager.connect();

    await this.currentUser.subscribeToRoom({
      roomId: this.GENERAL_ROOM_ID,
      hooks: {

        onMessage: message => {
          this.messages.push(message);
          this.messagesSubject.next(this.messages);
        }
      },
      onUserStartedTyping: user => {
        this.typingUsers.push(user.name);
      },
      onUserStoppedTyping: user => {
        this.typingUsers = this.typingUsers.filter(username => username !== user.name);
      },
      
      messageLimit: 20
    });


    const users = this.currentUser.rooms[this.GENERAL_ROOM_INDEX].users;
    this.usersSubject.next(users);
  }


  getUsers() {
    return this.usersSubject;
  }

  getMessages() {
    return this.messagesSubject;
  }

  sendMessage(message) {
    if (message.attachment) {
      return this.currentUser.sendMessage({
        text: message.text,
        attachment: { file: message.attachment, name: message.attachment.name },
        roomId: message.roomId || this.GENERAL_ROOM_ID
    });
  } else {
    return this.currentUser.sendMessage({
      text: message.text,
      roomId: message.roomId || this.GENERAL_ROOM_ID
    });
  }
}

  isUserOnline(user): boolean {
    return user.presence.state == 'online';
  }

  getCurrentUser() {
    return this.currentUser;
  }
  getTypingUsers(){
    return  this.typingUsers;
  }

  sendTypingEvent(roomId = this.GENERAL_ROOM_ID){
    return this.currentUser.isTypingIn({ roomId: roomId });
  }
}
