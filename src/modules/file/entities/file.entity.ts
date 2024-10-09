import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractTimeEntity } from '../../../common/entities/abstract-time.entity';

@Entity('file')
export class FileEntity extends AbstractTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;
}
