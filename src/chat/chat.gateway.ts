import { WebSocketServer, WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


//this should provide to the app module
@WebSocketGateway()
export class ChatGateway {

  @WebSocketServer()
  server: Server

  handleConnection(){

  }

  handleDisconnection(){

  }

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket){
    this.server.emit('message', data) // this emits data to all active clients
    console.log(data)
  }
}
