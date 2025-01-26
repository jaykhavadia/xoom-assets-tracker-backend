declare global {
    namespace Express {
        interface User {
        }
        interface Request {
            user?: User;
        }
    }
}
export declare const GetUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
