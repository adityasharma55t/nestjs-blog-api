import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt()
  @IsOptional()
  likes: number;

  @IsOptional()
  @IsArray()
  comments: { name: string; comment: string }[];
}
