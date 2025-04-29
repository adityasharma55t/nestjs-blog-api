import { IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRoles)
  role: string;
}
