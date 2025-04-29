import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async findUsersByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async createUser(user: CreateUserDto) {
    try {
      await this.userModel.create(user);
    } catch (error) {
      console.log(error);
      if (error.code === 11000)
        throw new BadRequestException('User Already Exists');
      throw new BadRequestException(error.message);
    }
  }

  async fetchAllUsers() {
    return this.userModel.find().lean();
  }
}
