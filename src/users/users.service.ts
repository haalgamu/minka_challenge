import { Injectable } from "@nestjs/common"
import { User } from "../entities"

import { User } from "../entities";

@Injectable()
export class UserService{

    findAll(): User[]{
        return [];
    }
}