import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  constructor(item?: Partial<Item>) {
    super();
    this.id = item?.id;
    this.updated_at = item?.updated_at;
    this.name = item?.name;
    this.description = item?.description;
    this.quantity = item?.quantity;
  }
}
