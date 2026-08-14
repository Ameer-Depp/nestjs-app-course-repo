// user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../../utils/constants';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { UserType } from '../../utils/enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  username!: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: true, // never returned by default queries
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CUSTOMER,
  })
  userType!: UserType;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_account_verified',
  })
  isAccountVerified!: boolean;

  @OneToMany(() => Product, (product) => product.user)
  products!: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt!: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt!: Date;
}
