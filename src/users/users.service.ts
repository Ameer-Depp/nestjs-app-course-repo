import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from '../../utils/types';

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

  private generateJwt(payload: JWTPayloadType) {
    return this.jwtService.signAsync(payload);
  }
}
