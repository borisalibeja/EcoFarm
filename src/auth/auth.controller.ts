import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Session,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { updatedRequest } from 'src/auth/interfaces/request-interface';
import { updatedSessionData } from 'src/auth/interfaces/session-data-interface';

@Controller('auth')
export class AuthController {
  @SetMetadata('isPublic', true)
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Req() req: updatedRequest, @Session() session: updatedSessionData) {
    session.user = {
      userId: req.user.userId,
      username: req.user.username,
      roles: req.user.roles,
      farmName: req.user.farmName,
      farmId: req.user.farmId
    };
    return {
      status: HttpStatus.OK,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        resolve({
          status: 204,
          message: 'Session destroyed',
        });
      });
    });
  }
}
