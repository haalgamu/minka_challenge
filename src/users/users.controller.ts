import { Controller, Post, Get, Delete } from "@nestjs/common";
import { User } from "../entities"
import { UserService } from "./users.service";

@Controller('user')
export class UsersController{
    constructor(private userService: UserService){}

    @Get()
    findAll():User[]{
        return this.userService.findAll();
    }
}