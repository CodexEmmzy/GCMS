"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Booking_1 = require("./entities/Booking");
const Session_1 = require("./entities/Session");
const Admin_1 = require("./entities/Admin");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Booking_1.Booking, Session_1.Session, Admin_1.Admin],
    synchronize: true,
});
//# sourceMappingURL=dataConnection.js.map