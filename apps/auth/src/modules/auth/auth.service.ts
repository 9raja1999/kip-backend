import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@app/shared';

@Injectable()
export class AuthService {
  login(data: LoginDto) {
    return {
      message: 'Login succeul',
      data: data,
    };
  }

  register(data: RegisterDto) {
    return {
      message: 'Register successful',
      data: data,
    };
  }
}
