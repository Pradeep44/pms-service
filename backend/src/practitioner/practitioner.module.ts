import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Practitioner,
  PractitionerSchema,
} from './schemas/practitioner.schema';
import { PractitionerController } from './practitioner.controller';
import { PractitionerService } from './practitioner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Practitioner.name,
        schema: PractitionerSchema,
      },
    ]),
  ],
  controllers: [PractitionerController],
  providers: [PractitionerService],
})
export class PractitionerModule {}
