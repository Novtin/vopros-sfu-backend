import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';

@Entity('question_rating')
@Check(`"value" IN (-1, 1)`)
@Unique(['questionId', 'userId'])
export class QuestionRatingEntity {
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

  @Column()
  value: number;
}
