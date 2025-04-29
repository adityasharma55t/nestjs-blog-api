import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UserRoles } from 'src/users/entities/user.entity';
import { JwtUserData } from 'src/auth/auth.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto, user: JwtUserData) {
    try {
      const blogData = { ...createBlogDto, author: user.sub };
      const blog = await this.blogModel.create(blogData);
      return blog;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create blog');
    }
  }

  async getBlogs() {
    try {
      return await this.blogModel
        .find()
        .populate('author', 'name _id')
        .populate('comments.user', 'name _id')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  async getBlog(id: string) {
    const blog = await this.blogModel
      .findById(id)
      .populate('author', 'name _id')
      .populate('comments.user', 'name _id')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async updateBlog(
    id: string,
    updateBlogDto: UpdateBlogDto,
    user: JwtUserData,
  ) {
    const blog = await this.blogModel.findById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (user.role !== UserRoles.ADMIN && blog.author.toString() !== user.sub) {
      throw new ForbiddenException('You are not allowed to update this blog');
    }

    try {
      const updatedBlog = await this.blogModel
        .findByIdAndUpdate(id, updateBlogDto, { new: true })
        .exec();

      return updatedBlog;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  async engageBlog(
    id: string,
    user: JwtUserData,
    like?: number,
    commentText?: string,
  ) {
    const updateFields: any = {};

    if (like !== undefined) {
      updateFields.$inc = { likes: 1 };
    }

    if (commentText) {
      updateFields.$push = { comments: { user: user.sub, text: commentText } };
    }

    try {
      const updatedBlog = await this.blogModel.findByIdAndUpdate(
        id,
        updateFields,
        { new: true },
      );

      if (!updatedBlog) {
        throw new NotFoundException('Blog not found');
      }

      return updatedBlog;
    } catch (error) {
      throw new InternalServerErrorException('Error updating the blog');
    }
  }

  async deleteBlog(id: string, user: JwtUserData) {
    try {
      const blog = await this.blogModel.findById(id);

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      if (
        user.role !== UserRoles.ADMIN &&
        blog.author.toString() !== user.sub
      ) {
        throw new ForbiddenException(
          'You do not have permission to delete this blog',
        );
      }
      return await this.blogModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete blog');
    }
  }
}
