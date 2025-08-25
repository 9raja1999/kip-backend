import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@app/shared';
import { RpcValidationPipe } from '../../common/pipes';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  @UsePipes(new RpcValidationPipe())
  async Login(data: LoginDto) {
    console.log('Auth Service: login called', data);
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'register' })
  @UsePipes(new RpcValidationPipe())
  async Register(data: RegisterDto) {
    console.log('Auth Service: register called', data);
    return this.authService.register(data);
  }
}
