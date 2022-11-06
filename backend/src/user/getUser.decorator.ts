import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './schemas/user.schema';

export const GetUser = createParamDecorator(
  (data, ctxt: ExecutionContext): User => {
    const request = ctxt.switchToHttp().getRequest();
    return request.user;
  },
);
