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

@Entity('question_view')
@Unique(['questionId', 'userId'])
export class QuestionViewEntity {
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
