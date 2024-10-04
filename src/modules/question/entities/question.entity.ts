import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('question')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column()
  authorId: number;

  @Column()
  description: string;

  @Column({ default: 0 })
  rating: number;

  //tags: TagEntity[];

  //images: FileEntity[];

  //comments: CommentEntity[];
}
