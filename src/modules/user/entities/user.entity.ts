import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';

@Entity('user')
export class UserEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ nullable: true })
  description: string;
}
