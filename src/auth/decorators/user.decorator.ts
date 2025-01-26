import { User } from "src/modules/user/entities/user.entity";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

declare global {
  namespace Express {
    interface User {}
    interface Request {
      user?: User;
    }
  }
}

export const GetUser = createParamDecorator(
  (data: keyof Express.User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
