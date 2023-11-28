import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

interface Typing{
  name: string,
  isTyping: boolean
}

interface User{
  name: string,
  client: Socket
}

@WebSocketGateway({})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(private readonly messagesService: MessagesService) {}

  onlineUsers: User[] = []


  @WebSocketServer()
  server: Server

  afterInit(server: Server) {
    console.log('Server started.')
  }

  handleConnection(client: Socket) {
      console.log('Connected: ' + client.id)
  }

  handleDisconnect(client: Socket) {
      console.log('Disconnected: ' + client.id)
      this.onlineUsers = this.onlineUsers.filter((user)=>{
        user.client != client
      })
  }

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
    return this.messagesService.findAll()
  }

  @SubscribeMessage('typing')
  async typing(
      @MessageBody() typing: Typing,
      @ConnectedSocket() client: Socket
  ) {

    //const name = await this.messagesService.getClientById(client.id)
    const name = typing.name
    const isTyping = typing.isTyping
    client.broadcast.emit('typing', {name, isTyping}) //broadcast emits to everytone except for the sender 
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string, 
    @ConnectedSocket() client: Socket
    ) {
      if(this.onlineUsers.every(user=> user.name !=name)){
        client.broadcast.emit('joined', name)
        this.onlineUsers.push({name, client})
        console.log(name)
      }
    //return this.messagesService.authenticate(name, client.id)
    
  }


  


}
