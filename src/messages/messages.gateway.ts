import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';



@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto, 
    @ConnectedSocket() client: Socket
    ) {

    const msg = await this.messagesService.create(createMessageDto, client.id)
    this.server.emit('newMessage', msg)
    return msg
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    const t = this.messagesService.findAll()
    console.log(t)
    return t
  }

  @SubscribeMessage('typing')
  async typing(
      @MessageBody('isTyping') isTyping: boolean,
      @ConnectedSocket() client: Socket
  ) {

    const name = await this.messagesService.getClientById(client.id)
    client.broadcast.emit('typing', {name, isTyping}) //broadcast emits to everytone except for the sender 
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string, 
    @ConnectedSocket() client: Socket
    ) {
    return this.messagesService.authenticate(name, client.id)
  }
  


}