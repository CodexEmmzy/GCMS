import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  Unique,
  ManyToOne,
} from "typeorm";
import { Session } from "./Session";
import { BookingStatus } from "../utils/constant";
import { Admin } from "./Admin";



@Entity()
@Unique(["session", "admin"])
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  BookingID!: number;

  @Column()
  adminId!: number;

  @ManyToOne(() => Admin, (admin) => admin.bookings)
  admin!: Admin;

  @OneToOne(() => Session, seasion => seasion.booking)
  @JoinColumn()
  session: Session;

  @Column({ nullable: false })
  allocatedTV: string;

  @Column({ nullable: false })
  userName: string;

  @Column()
  QRCode!: string;

  @Column({ nullable: false, default: BookingStatus.UNACTIVE})
  Status: BookingStatus;

  @Column({ nullable: false })
  numberOfSessions: number;

  @CreateDateColumn({ nullable: false })
  BookingTime!: Date;

}
