import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Practitioner } from './schemas/practitioner.schema';

const s3 = new S3Client({
  credentials: {
    accessKeyId: 'AKIAYMAPGIQH57JDOLBC',
    secretAccessKey: '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',
  },
  region: 'us-west-2',
});

@Injectable()
export class PractitionerService {
  constructor(
    @InjectModel(Practitioner.name)
    private readonly pracModel: Model<Practitioner>,
  ) {}

  async createPractitioner(
    userId: mongoose.ObjectId,
    name: string,
    email: string,
    contact: string,
    dob: string,
    workingDays: string[],
    startTime: string,
    endTime: string,
    image: string,
  ) {
    const practitioner = new this.pracModel({
      name,
      email,
      contact,
      dob,
      workingDays,
      startTime,
      endTime,
      image,
      user: userId,
    });

    await practitioner.save();

    return {
      message: 'Created successfully',
    };
  }

  async deletePractitioner(userId: mongoose.ObjectId, practitionerId: string) {
    await this.pracModel.findOneAndRemove({
      _id: new mongoose.Types.ObjectId(practitionerId),
      user: userId,
    });
    return { message: 'Deleted successfully' };
  }

  async updatePractitioner(
    userId: mongoose.ObjectId,
    practitionerId: string,
    name: string,
    email: string,
    contact: string,
    dob: string,
    workingDays: string[],
    startTime: string,
    endTime: string,
    image: string,
    isICUSpecialist?: boolean,
  ) {
    const updatePayload: any = {
      name,
      email,
      contact,
      dob,
      workingDays,
      startTime,
      endTime,
      image,
      isICUSpecialist: isICUSpecialist || false,
    };

    await this.pracModel.findOneAndUpdate(
      {
        _id: new mongoose.mongo.ObjectId(practitionerId),
        user: userId,
      },
      updatePayload,
    );

    return {
      message: 'Updated successfully',
    };
  }

  async getPractitionerDetail(
    userId: mongoose.ObjectId,
    practitionerId: string,
  ) {
    const practitioner = await this.pracModel.findOne({
      _id: practitionerId,
      user: userId,
    });
    practitioner.image = await this.getImageURL(practitioner.image);

    return { practitioner };
  }

  async getPractitionerList(userId: mongoose.ObjectId) {
    const practitionerList = await this.pracModel
      .find({ user: userId })
      .sort({ name: 1, isICUSpecialist: -1 });

    const pracListWithImageURL = await Promise.all(
      practitionerList.map(async (practitioner) => {
        practitioner.image = await this.getImageURL(practitioner.image);
        return practitioner;
      }),
    );

    return { practitionerList: pracListWithImageURL };
  }

  async getImageURL(imageURL: string) {
    const bucket = 'carwash-udeep';
    const getParams = {
      Bucket: bucket,
      Key: imageURL,
    };

    const publicImageURL = await getSignedUrl(
      s3,
      new GetObjectCommand(getParams),
      { expiresIn: 15 * 60 },
    );

    return publicImageURL;
  }

  async uploadImage(userId: mongoose.ObjectId, image: any) {
    const bucket = 'carwash-udeep';
    const fileName = userId + '_' + image.originalname;
    const buffer = image.buffer;

    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      Body: buffer,
    };

    await s3.send(new PutObjectCommand(uploadParams));
    return fileName;
  }
}
