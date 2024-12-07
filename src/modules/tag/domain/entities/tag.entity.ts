import { AbstractTimeEntity } from '../../../../common/entities/abstract-time.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tag')
export class TagEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
