import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { SERVICES_ENUM } from '@app/shared';
import { LoginDto, RegisterDto } from '@app/shared';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES_ENUM.AUTH_SERVICE)
    private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  @HttpCode(200)
  async Login(@Body() loginDto: LoginDto) {
    const response$ = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto).pipe(
        catchError((err) => {
          if (err?.statusCode === 422) {
            return throwError(() => new UnprocessableEntityException(err));
          }
          return throwError(() => err);
        }),
      ),
    );

    return response$;
  }

  @Post('register')
  async Register(@Body() registerDto: RegisterDto) {
    const response$ = await firstValueFrom(
      this.authClient.send({ cmd: 'register' }, registerDto).pipe(
        catchError((err) => {
          if (err?.statusCode === 422) {
            return throwError(() => new UnprocessableEntityException(err));
          }
          return throwError(() => err);
        }),
      ),
    );

    return response$;
  }
}
