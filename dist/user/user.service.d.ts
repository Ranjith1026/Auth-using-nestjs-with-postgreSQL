import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UpdateResult, DeleteResult } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(data: any): Promise<User>;
    findOne(condition: any): Promise<User>;
    update(user: User): Promise<UpdateResult>;
    delete(id: any): Promise<DeleteResult>;
}
