import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: HttpException | Error) => {
        if (error instanceof HttpException) {
          throw error
        } else {
          throw new HttpException(
            {
              message: error.message,
              stack: error.stack,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          )
        }
      }),
    )
  }
}
