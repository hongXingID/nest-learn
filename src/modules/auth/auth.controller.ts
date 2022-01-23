import {
  Controller,
  HttpStatus,
  HttpCode,
  Get,
  Post,
  Query,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user) {
    const res = await this.authService.login(user);
    const { id, name, avatar, email, role, status, type, token } = res
    return { id, name, avatar, email, role, status, type, token }
  }

  @Post('admin')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  createBook() {
    console.log()
    return this.authService.checkAdmin();
  }

  @Post('github')
  loginWithGithub(@Body('code') code) {
    return this.authService.loginWithGithub(code);
  }
}
