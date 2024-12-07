import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { AbstractTimeEntity } from '../../../../common/entities/abstract-time.entity';
import { RoleEntity } from './role.entity';
import { FileEntity } from '../../../file/domain/entities/file.entity';
import { QuestionEntity } from '../../../question/domain/entities/question.entity';
import { AnswerEntity } from '../../../answer/domain/entities/answer.entity';

@Entity('user')
export class UserEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column()
  emailHash: string;

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_role' })
  roles: RoleEntity[];

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'avatarId' })
  avatar: FileEntity;

  @Column('int', { name: 'avatarId', nullable: true })
  avatarId: number;

  @OneToMany(() => QuestionEntity, (question) => question.author)
  questions: QuestionEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.author)
  answers: AnswerEntity[];

  @VirtualColumn({
    type: 'int',
    query: (alias) => `
      COALESCE(
        (SELECT SUM(question_rating.value)
         FROM question_rating
         INNER JOIN question ON question.id = question_rating."questionId"
         WHERE question."authorId" = ${alias}.id), 0
      ) + 
      COALESCE(
        (SELECT SUM(answer_rating.value)
         FROM answer_rating
         INNER JOIN answer ON answer.id = answer_rating."answerId"
         WHERE answer."authorId" = ${alias}.id), 0
      )
    `,
  })
  rating: number;
}
