import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
    userId(req: any): any {
        const user = req.user;
        const userId = user.userId;
        return userId;
    }
}
