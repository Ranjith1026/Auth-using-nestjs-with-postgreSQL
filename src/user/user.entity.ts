import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('det')
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column()
    email:string;

    @Column()
    firstname:string;

    @Column()
    lastname:string;

    @Column()
    password:string;

    @Column()
    dob:string;

    @Column()
    about_me:string;

    
}
