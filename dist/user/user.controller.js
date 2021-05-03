"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./user.entity");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(username, email, firstname, lastname, password, dob, about_me) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user1 = await this.userService.create({
            username,
            email,
            firstname,
            lastname,
            password: hashedPassword,
            dob,
            about_me
        });
        delete user1.password;
        return "Account created successfully";
    }
    async login(username, password, response) {
        const user1 = await this.userService.findOne({ username });
        if (!user1) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        if (!await bcrypt.compare(password, user1.password)) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const jwt = await this.jwtService.signAsync({ id: user1.id });
        response.cookie('jwt', jwt, { httpOnly: true });
        return 'Login Successfully';
    }
    async user(request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data) {
                throw new common_1.UnauthorizedException();
            }
            const user = await this.userService.findOne({ id: data['id'] });
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    async profile(username, password, response) {
        const user1 = await this.userService.findOne({ username });
        if (!user1) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        if (!await bcrypt.compare(password, user1.password)) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const jwt = await this.jwtService.signAsync({ id: user1.id });
        response.cookie('jwt', jwt, { httpOnly: true });
        delete user1.password;
        return user1;
    }
    async logout(response) {
        response.clearCookie('jwt');
        return 'Logout successfully';
    }
    async delete(id) {
        return this.userService.delete(id);
    }
    update(id, userData) {
        userData.id = Number(id);
        return this.userService.update(userData);
    }
};
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body('username')),
    __param(1, common_1.Body('email')),
    __param(2, common_1.Body('firstname')),
    __param(3, common_1.Body('lastname')),
    __param(4, common_1.Body('password')),
    __param(5, common_1.Body('dob')),
    __param(6, common_1.Body('about_me')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body('username')),
    __param(1, common_1.Body('password')),
    __param(2, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    common_1.Get('user'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "user", null);
__decorate([
    common_1.Get('login/profile'),
    __param(0, common_1.Body('username')),
    __param(1, common_1.Body('password')),
    __param(2, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "profile", null);
__decorate([
    common_1.Post('logout'),
    __param(0, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    common_1.Delete(':id/delete'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    common_1.Put(':id/update'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
UserController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map