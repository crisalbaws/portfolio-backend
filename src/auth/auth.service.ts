import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiResponse } from '../common/response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '../common/common.service';

@Injectable()
export class AuthService {
  constructor(@
    InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private commonService: CommonService
  ) {

  }
  async login(loginAuthDto: LoginAuthDto): Promise<ApiResponse> {
    try {

      const userFind = await this.usersRepository.findOne({
        where: {
          email: loginAuthDto.email
        },
      });
      if (!userFind) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "Credenciales incorrectas");
      const validatePassword = await compare(loginAuthDto.password, userFind.password);
      if (!validatePassword) return this.commonService.processResponse(null, HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");

      const payload = { id: userFind.id, name: userFind.completeName }
      const token = await this.jwtService.sign(payload);
      const data = {
        token
      }
      return this.commonService.processResponse(data, HttpStatus.OK, "Correcto");

    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, error.message);

    }
  }
}