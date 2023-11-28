import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MessageDocument = HydratedDocument<Message>

@Schema()
export class Message{
    @Prop()
    name: string
    
    @Prop()
    text: string

    @Prop({type: Date})
    date: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)