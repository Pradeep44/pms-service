import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { PractitionerModule } from './practitioner/practitioner.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:TaICVJ6ZUj26Q8g9@cluster0.nobfqsk.mongodb.net/?retryWrites=true&w=majority',
    ),
    UserModule,
    PractitionerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
