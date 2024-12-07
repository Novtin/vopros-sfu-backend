import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { AbstractTimeEntity } from '../../../../common/entities/abstract-time.entity';
import { FileEntity } from '../../../file/domain/entities/file.entity';
import { TagEntity } from '../../../tag/domain/entities/tag.entity';
import { AnswerEntity } from '../../../answer/domain/entities/answer.entity';
import { QuestionViewEntity } from './question-view.entity';
import { QuestionRatingEntity } from './question-rating.entity';

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

  @ManyToMany(() => FileEntity)
  @JoinTable({ name: 'question_image' })
  images: FileEntity[];

  @ManyToMany(() => TagEntity)
  @JoinTable({ name: 'question_tag' })
  tags: TagEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.question)
  answers: AnswerEntity[];

  @OneToMany(() => QuestionViewEntity, (view) => view.question)
  views: QuestionViewEntity[];

  @OneToMany(() => QuestionRatingEntity, (rate) => rate.question)
  rating: QuestionRatingEntity[];
}
