/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from '../../utils/types';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserType } from '../../utils/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(dto: RegisterDto): Promise<AccessTokenType> {
    const { email, password, username } = dto;

    const userFromDB = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (userFromDB) {
      if (userFromDB.email === email) {
        throw new BadRequestException('user with this email already exists');
      }
      throw new BadRequestException('username is already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (err: any) {
      // Fallback safety net for race conditions (two requests at once)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.code === '23505') {
        throw new BadRequestException('username or email already exists');
      }
      throw err;
    }

    const accessToken = await this.generateJwt({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { accessToken };
  }

  public async login(dto: LoginDto): Promise<AccessTokenType> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('invalid email or password');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new BadRequestException('invalid email or password');

    const accessToken = await this.generateJwt({
      id: user.id,
      userType: user.userType,
    });
    return { accessToken };
  }

  public async getCurrentUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  public async updateUser(
    currentUser: JWTPayloadType,
    targetId: number,
    dto: UpdateUserDTO,
  ) {
    if (
      currentUser.userType !== UserType.ADMIN &&
      currentUser.id !== targetId
    ) {
      throw new ForbiddenException('You can only update your own account');
    }

    const { password, username } = dto;
    const user = await this.userRepository.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('user is not found');

    user.username = username ?? user.username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const existingUserName = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (username) {
      const existingUserName = await this.userRepository.findOne({
        where: { username },
      });

      if (existingUserName && existingUserName.id !== targetId) {
        throw new BadRequestException('this username already exists');
      }

      user.username = username;
    }
    return this.userRepository.save(user);
  }

  public async deleteUser(currentUser: JWTPayloadType, targetId: number) {
    if (
      currentUser.userType !== UserType.ADMIN &&
      currentUser.id !== targetId
    ) {
      throw new ForbiddenException('You can only delete your own account');
    }

    const user = await this.userRepository.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('user is not found');

    await this.userRepository.remove(user);

    return { message: 'user deleted successfully' };
  }

  private generateJwt(payload: JWTPayloadType) {
    return this.jwtService.signAsync(payload);
  }

  public getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
