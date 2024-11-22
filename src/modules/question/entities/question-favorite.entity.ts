import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Unique(['questionId', 'userId'])
@Entity('question_favorite')
export class QuestionFavoriteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'questionId' })
  question: QuestionEntity;

  @Column()
  questionId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;
}
