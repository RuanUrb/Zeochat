import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Types } from 'mongoose';

interface JwtUser{
  name: string
  email: string
  avatarUrl: string
  _id: Types.ObjectId
}

interface User{
  name: string,
  avatarUrl: string
}

@WebSocketGateway({})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(private readonly messagesService: MessagesService, private readonly authService: AuthService){}

  onlineUsers: {client: Socket, user: User}[] = []

  @WebSocketServer()
  server: Server

  afterInit(client: Socket) {
    console.log('Server started.')
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token
    try{
      const payload = await this.authService.verify(token)
      const id = payload.sub
      const meinUser: JwtUser = await this.authService.findUserById(id)
      const user: User = {name: meinUser.name, avatarUrl: meinUser.avatarUrl}

      if(this.onlineUsers.some(onUser=>onUser.user.name == user.name)){
        throw new Error('Existing session in another tab.')
      }
      this.onlineUsers.push({client, user})
      this.server.to(client.id).emit('userAuthenticated', user)
      this.server.emit('joinRoom', user)
      console.log('Connected: ' + client.id)
      return user
  }catch(e){

      console.log('it sucks.')
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    //SE TIVER ONLINE USER ASSOCIADO, SENAO EH SO TENTATIVA DE ENTRAR DESLOGADO
      //esse código está removendo todo mundo da sala
      console.log('Disconnected: ' + client.id)
      const user = this.getUserByClient(client.id)
      if(user){
        console.log(user)
          this.server.emit('leaveRoom', user)
          this.onlineUsers = this.onlineUsers.filter(user=>
            user.client != client
        )
      }

    }

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() text: string, 
    @ConnectedSocket() client: Socket
    ) {
    const myUser = this.getUserByClient(client.id)
    const msg = await this.messagesService.create(text, myUser)
    this.server.emit('newMessage', msg)
    return msg
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll()
  }

  @SubscribeMessage('typing')
  async typing(@ConnectedSocket() client: Socket) {
    const user = this.getUserByClient(client.id)
    client.broadcast.emit('typing', user.name) //broadcast emits to everytone except for the sender 
  }

  @SubscribeMessage('getOnlineUsers')
  getOnlineUsers(){
     return this.onlineUsers.map((userInstance)=>userInstance.user)
  }

  private getUserByClient(clientId:string){
      for(const data of this.onlineUsers){
        if(data.client.id === clientId) return data.user
      }
      return null
  }

  private logOnlineUsers(){
    for(const onUser of this.onlineUsers){
      console.log(onUser.user.name)
    }
  }

}
