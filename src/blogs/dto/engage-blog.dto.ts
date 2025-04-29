import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class EngageBlogDto {
  @ValidateIf(
    (obj) => obj.commentText === undefined || obj.commentText === null,
  )
  @IsInt()
  like: number;

  @ValidateIf((obj) => obj.like === undefined || obj.like === null)
  @IsString()
  commentText: string;
}
