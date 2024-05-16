import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Booking } from "./Booking";


@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => Booking, (booking) => booking.admin)
  bookings: Booking[];

  @UpdateDateColumn()
  updateDate!: string;

  @CreateDateColumn()
  createDate!: string;
}
