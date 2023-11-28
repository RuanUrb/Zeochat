import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/schemas/message.schema';
import { Model } from 'mongoose';


@Injectable()
export class MessagesService {
  //messages: Message[] = []
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>){}


  async create(createMessageDto: CreateMessageDto, clientId: string) {
    const {name, text} = createMessageDto
    const newMsg = await this.messageModel.create({name, text, date: new Date()})
    return newMsg
  }

  async findAll() {
    const bns = await this.messageModel.find({})
    console.log(bns)
    return bns
  }
  /*
  authenticate(name: string, clientId: string){
    this.clients[clientId] = name
    console.log(clientId, name)
    //return Object.values(this.clients)
  }
*/
  getClientById(clientId: string){

  }

}
