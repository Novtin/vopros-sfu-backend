import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('question_view')
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

  userId: number;
}
