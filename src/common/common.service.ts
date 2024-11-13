import { Injectable } from "@nestjs/common";
import { ApiResponse } from "./response.interface";


@Injectable()
export class CommonService {
    processResponse(data: any | any[], statusCode: number = 200, message: string = "Correcto"): ApiResponse {
        const newReponse: ApiResponse = {
            data,
            statusCode,
            message
        }
        return newReponse;
    }
}