import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { AnswerEntity } from './answer.entity';

@Entity('answer_rating')
@Check(`"value" IN (-1, 1)`)
@Unique(['answerId', 'userId'])
export class AnswerRatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AnswerEntity)
  @JoinColumn({ name: 'answerId' })
  answer: AnswerEntity;

  @Column()
  answerId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;

  @Column()
  value: number;
}
