/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JWTPayloadType } from '../../utils/types';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from '../../utils/enums';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return await this.usersService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return await this.usersService.login(dto);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public updateUser(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id') targetId: number,
    @Body() body: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(payload, targetId, body);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public deleteUser(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id') targetId: number,
  ) {
    return this.usersService.deleteUser(payload, targetId);
  }
}
