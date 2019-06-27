import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// para poder crear el usuario se crea un metodo que verifica que ese email no este registrado
// se utiliza para iniciar session y registrar el usuario


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async  findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
    }
    async  create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
