import { DataSource } from "typeorm";
import { Booking } from "./entities/Booking";
import { Session } from "./entities/Session";
import { Admin } from "./entities/Admin";
import dotenv from "dotenv";

dotenv.config()

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Booking, Session, Admin],
  synchronize: true,
});
