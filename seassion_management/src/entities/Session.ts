import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Booking } from "./Booking";
import { SeassionStatus } from "../utils/constant";

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  bookingId!: number;

  @OneToOne(() => Booking, booking => booking.session)
  @JoinColumn()
  booking!: Booking;

  @Column({ nullable: false })
  Status: SeassionStatus;

  @Column()
  timeRemaining!: number;
}
