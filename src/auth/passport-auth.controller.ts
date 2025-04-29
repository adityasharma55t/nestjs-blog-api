import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class PassportController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto);
  }

  @Post('signup')
  signup(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(PassportJwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @Get('all-users')
  @UseGuards(PassportJwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
