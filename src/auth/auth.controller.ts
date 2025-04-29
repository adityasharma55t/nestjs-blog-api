// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   UseGuards,
//   Request,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthGuard } from './guards/auth.guard';

// @Controller('authv2')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('login')
//   login(@Body() loginUserDto: { email: string; password: string }) {
//     return this.authService.authenticate(
//       loginUserDto.email,
//       loginUserDto.password,
//     );
//   }
//   @UseGuards(AuthGuard)
//   @Get('profile')
//   getProfile(@Request() req) {
//     return req.user;
//   }
// }
