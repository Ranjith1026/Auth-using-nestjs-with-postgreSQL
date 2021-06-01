import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {UpdateResult, DeleteResult } from  'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
    }

    async create(data: any): Promise<User> {
        return this.userRepository.save(data);  
    }

    
    async findOne(condition: any): Promise<User> {
        return this.userRepository.findOne(condition);
    }

    async update(user: User): Promise<UpdateResult> {
        return  this.userRepository.update(user.id, user);
    }
   
    async delete(id): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }
    
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
      }
   
}
