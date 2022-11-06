import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Practitioner extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  workingDays: string[];

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: false })
  isICUSpecialist: boolean;

  @Prop()
  user: Types.ObjectId;
}

export const PractitionerSchema = SchemaFactory.createForClass(Practitioner);
