import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';
import { RoleEntity } from './role.entity';
import { FileEntity } from '../../file/entities/file.entity';

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

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'avatarId' })
  avatar: FileEntity;

  @Column('int', { name: 'avatarId', nullable: true })
  avatarId: number;
}
