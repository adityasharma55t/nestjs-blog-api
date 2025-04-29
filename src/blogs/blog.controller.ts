import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtUserData } from 'src/auth/auth.service';
import { EngageBlogDto } from './dto/engage-blog.dto';
import { MongoIdDto } from 'src/common/dto/mongo-id.dto';

@ApiBearerAuth()
@UseGuards(PassportJwtAuthGuard)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({
    status: 200,
    description: 'List of blogs returned successfully',
  })
  @Post('create')
  createBlog(@Request() request, @Body() createBlogDto: CreateBlogDto) {
    console.log(createBlogDto);

    return this.blogService.createBlog(
      createBlogDto,
      request.user as JwtUserData,
    );
  }

  @Get()
  getBlogs() {
    return this.blogService.getBlogs();
  }

  @Get(':id')
  getBlog(@Param() param: MongoIdDto) {
    return this.blogService.getBlog(param.id);
  }

  @Patch('update/:id')
  updateBlog(
    @Request() request,
    @Param() param: MongoIdDto,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(
      param.id,
      updateBlogDto,
      request.user as JwtUserData,
    );
  }

  @Post('engage/:id')
  engageBlog(
    @Request() request,
    @Param() param: MongoIdDto,
    @Body() engageBlogDto: EngageBlogDto,
  ) {
    return this.blogService.engageBlog(
      param.id,
      request.user as JwtUserData,
      engageBlogDto.like,
      engageBlogDto.commentText,
    );
  }

  @Delete('delete/:id')
  deleteBlog(@Request() request, @Param() param: MongoIdDto) {
    return this.blogService.deleteBlog(param.id, request.user as JwtUserData);
  }
}
