import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import RegisterNewUserDto from './dtos/register-new-user.dto';
import LoginDTO from './dtos/login.dto';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  public async login(loginDTO: LoginDTO): Promise<string> {
    const { name, password } = loginDTO;
    const isExist = await this.isUserExist(name, password);
    if (!isExist)
      throw new Error(`the user doesn't exist`);
    const token = await this.createToken(name);
    return token;
  }
  
  private async createToken(userName: string): Promise<string> {
    const userId = await this.getUserId(userName);
    const token = await this.jwtService.signAsync({
      userId,
    });
        
    return token;
  }

  private async getUserId(name: string): Promise<string> {
    const user = await this.userModel.findOne({
      name,
    });
    return user._id.toString();
  }

  public async registerNewUser(newUser: RegisterNewUserDto): Promise<void> {
    const { name, password, nickname } = newUser;
    const isExist = await this.isUserExist(name);
    if (isExist)
      throw new Error(`the user is already exist.`);

    const hashedPassword = await this.stringToHash(password);
    const userInstance = await this.userModel.create({
      name,
      password: hashedPassword,
      nickname
    });
    await userInstance.save();
  }

  private async isUserExist(name: string, password?: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      name,
    });
    const isExist = user != null;
    if (!isExist)
      return false;

    if (password) {
      const passwordIsCorrect = await bcrypt.compare(password, user.password);
      return passwordIsCorrect;  
    }
    return true;
  }

  private async stringToHash(rawString: string): Promise<string> {
    const hashedString = await bcrypt.hash(rawString, 10);
    return hashedString;
  }
}
