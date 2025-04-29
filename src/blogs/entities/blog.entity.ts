import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type BlogDocument = mongoose.HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  _id?: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: {
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    date: Date;
  }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: mongoose.Schema.Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.pre('save', function (next) {
  this.title = this.title.trim();
  this.content = this.content.trim();
  next();
});
