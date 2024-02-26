import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt} from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { promisify } from 'util';
import { LoginUserDto, loginUserSchema } from './dto/login-user.dto';



const scrypt = promisify(_scrypt)



@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private jwtService: JwtService){}

    async createUser(CreateUserDto: CreateUserDto){
        const {name, email, password, avatarUrl} = CreateUserDto
        
        const validationResult = createUserSchema.validate(CreateUserDto)
        if(validationResult.error) throw new BadRequestException('Invalid data submit.')



        const emailCheck = await this.userModel.find({email})
        if(emailCheck.length) throw new BadRequestException('Email already in use.')
        const nameCheck = await this.userModel.find({name})
        if(nameCheck.length) throw new BadRequestException('Nickname already in use.')

        const salt = randomBytes(8).toString('hex')
        const hash = (await scrypt(password, salt, 32)) as Buffer
        const result = salt + '.' + hash.toString('hex')
        return this.userModel.create({name, email, password: result, avatarUrl})
    }

    async signin(loginUserDto: LoginUserDto){
        const {email, password} = loginUserDto
        const validationResult = loginUserSchema.validate(loginUserDto)
        if(validationResult.error) throw new BadRequestException('Please enter valid data.')

        const [user] = await this.userModel.find({email})
        if(!user) throw new NotFoundException('Incorrect e-mail or password. Please verify your data.')

        const [ salt, savedHash] = user.password.split('.')
        const hash = (await scrypt(password, salt, 32)) as Buffer
        if(savedHash !== hash.toString('hex')) throw new BadRequestException('Incorrect e-mail or password. Please verify your data.')
        const payload = {sub: user._id, name: user.name, avatarUrl: user.avatarUrl}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async verify(signature: string) {
        return await this.jwtService.verifyAsync(signature)
    }

    async findUserById(id: string){
        const user =  await this.userModel.findById(id).lean()
        const {password, ...result} = user
        return result
    }

    async findUserByName(name: string){
        const user = await this.userModel.findOne({name: name}).exec()
        const {password, email, ...result} = user
        return result
    }


}
