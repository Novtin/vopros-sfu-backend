import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionEntity } from '../../question/entities/question.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';

@Entity('answer')
export class AnswerEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestionEntity, (question) => question.answers)
  @JoinColumn({ name: 'questionId' })
  question: QuestionEntity;

  @Column('int', { name: 'questionId' })
  questionId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column('int', { name: 'authorId' })
  authorId: number;

  @Column()
  text: string;

  @Column({ default: false })
  isSolution: boolean;
}