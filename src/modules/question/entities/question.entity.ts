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
import { UserEntity } from '../../user/entities/user.entity';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { TagEntity } from '../../tag/entities/tag.entity';
import { AnswerEntity } from '../../answer/entities/answer.entity';
import { QuestionViewEntity } from './question-view.entity';

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

  //views: numbers;

  //answers: AnswersEntity[];
}
