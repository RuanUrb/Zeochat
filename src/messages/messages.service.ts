import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesService {
  messages: Message[] = []
  
  clients = {}

  create(createMessageDto: CreateMessageDto, clientId: string) {
    //name: this.clients[clientId]
    const msg = {name: createMessageDto.name, text: createMessageDto.text, date: createMessageDto.date} 
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
