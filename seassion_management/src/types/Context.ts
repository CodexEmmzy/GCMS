import { DataSource } from "typeorm";

export type Context = {
  [x: string]: any;
  dbConnection: DataSource;
  adminId: number | undefined;
};
