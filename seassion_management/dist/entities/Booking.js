"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const Session_1 = require("./Session");
const constant_1 = require("../utils/constant");
const Admin_1 = require("./Admin");
let Booking = class Booking extends typeorm_1.BaseEntity {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "BookingID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Booking.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, (admin) => admin.bookings),
    __metadata("design:type", Admin_1.Admin)
], Booking.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Session_1.Session, seasion => seasion.booking),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Session_1.Session)
], Booking.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Booking.prototype, "allocatedTV", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Booking.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "QRCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: constant_1.BookingStatus.UNACTIVE }),
    __metadata("design:type", String)
], Booking.prototype, "Status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfSessions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Booking.prototype, "BookingTime", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["session", "admin"])
], Booking);
//# sourceMappingURL=Booking.js.map