import { IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../entities/user.entity';

export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
