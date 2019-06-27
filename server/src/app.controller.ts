import { Post, Body,Request, Controller} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.entity';

// creamos un token que será utilizado por el SDK del cliente Chatkit
// para solicitar tokens (Json Web Token) de nuestro servidor.

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async token(@Request() req): Promise<any> {
    return this.authService.getToken(req.query.user_id).body;
  }

  @Post('login')
  async login(@Body() userData: User): Promise<any> {
    return this.authService.login(userData);
  }  

  @Post('register')
  async register(@Body() userData: User): Promise<any> {

    return this.authService.register(userData);
  }
  
}
