import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';
import { FileEntity } from '../../file/entities/file.entity';

@Entity('question')
export class QuestionEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column()
  authorId: number;

  @Column()
  description: string;

  @Column({ default: 0 })
  rating: number;

  @ManyToMany(() => QuestionEntity)
  @JoinTable({ name: 'question_image' })
  images: FileEntity[];

  //views: numbers;

  //tags: TagEntity[];

  //answers: AnswersEntity[];
}
