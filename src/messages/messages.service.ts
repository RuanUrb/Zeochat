import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesService {
  messages: Message[] = [{name: 'TopZ', text: 'i am the top Z.'}]
  
  clients = {}

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const msg = {name: this.clients[clientId], text: createMessageDto.text} 
    this.messages.push(msg)
    console.log(msg)
    return msg
  }

  findAll() {
    return this.messages
  }

  authenticate(name: string, clientId: string){
    this.clients[clientId] = name
    console.log(clientId, name)
    //return Object.values(this.clients)
  }

  getClientById(clientId: string){

  }

}
