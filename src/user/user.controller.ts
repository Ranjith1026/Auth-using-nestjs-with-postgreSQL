import {BadRequestException, Body, Controller, Delete, Get, Post, Put, Req, Res, UnauthorizedException, Param, NotFoundException} from '@nestjs/common';
import {UserService} from './user.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';
import {User} from "./user.entity";


@Controller('auth')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {
    }   

    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('firstname') firstname: string,
        @Body('lastname') lastname: string,
        @Body('password') password: string,
        @Body('dob') dob:string,
        @Body('about_me') about_me:string
    ) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user1= await this.userService.create({
            username,
            email,
            firstname,
            lastname,
            password:hashedPassword,
            dob,
            about_me
        });
        
        delete user1.password;
        return "Account created successfully";
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user1 = await this.userService.findOne({username});

        if (!user1) {
            throw new BadRequestException('invalid credentials');
        }

        if (!await bcrypt.compare(password, user1.password)) {
            throw new BadRequestException('invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user1.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return 'Login Successfully';
        
    }

    @Get('user')
    findAll(): Promise<User[]> {
        return this.userService.findAll();
      }

    @Get('login/profile')
    async profile(
        @Body('username') username: string,
        @Body('password') password: string, 
        @Res({passthrough: true}) response: Response,
    ) 
                 
    {
        const user1 = await this.userService.findOne({username});

        if (!user1) {
            throw new BadRequestException('invalid credentials');
        }

        if (!await bcrypt.compare(password, user1.password)) {
            throw new BadRequestException('invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user1.id});

        response.cookie('jwt', jwt, {httpOnly: true});
        
        
        delete user1.password;
        return user1;
        
    }


    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return 'Logout successfully';
       
    }

    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.userService.delete(id);
    }  

    @Put(':id/update')
    update(@Param('id') id: string, @Body() userData: User) {
        userData.id = Number(id);
      return this.userService.update(userData);
    }




    }




