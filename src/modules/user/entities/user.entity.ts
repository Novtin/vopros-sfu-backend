import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';
import { RoleEntity } from './role.entity';

@Entity('user')
export class UserEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_role' })
  roles: RoleEntity[];
}
