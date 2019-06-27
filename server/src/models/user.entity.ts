import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// se genera la entidad del usuario donde estan sus atributos para ser guardado en la 
// base de datos local

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  email: string;

  @Column()
  password: string;
}