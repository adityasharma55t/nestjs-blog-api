import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/users/entities/user.entity';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

export type JwtUserData = {
  sub: string;
  name: string;
  email: string;
  role: UserRoles;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(email: string, password: string) {
    const user = await this.validateUser(email, password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUsersByEmail(email);

    if (!user) throw new NotFoundException();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException();

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async signIn(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) throw new NotFoundException();
    const tokenPayload: JwtUserData = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return { accessToken, ...tokenPayload };
  }

  async signUp(user: CreateUserDto) {
    console.log(user);

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await this.usersService.createUser(user);
  }

  async getAllUsers() {
    const users = await this.usersService.fetchAllUsers();
    return users;
  }
}
