"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBookingById = exports.QueryAllBookings = exports.BookingTypeDef = void 0;
const nexus_1 = require("nexus");
const Session_1 = require("../entities/Session");
const Booking_1 = require("../entities/Booking");
const BookingStatusEnum = (0, nexus_1.enumType)({
    name: "BookingStatus",
    members: Booking_1.BookingStatus,
});
const BookingTypeDef = (0, nexus_1.objectType)({
    name: "Booking",
    definition(t) {
        t.nonNull.int("BookingID");
        t.nonNull.int("sessionId");
        t.field("session", {
            type: "Session",
            resolve(parent, _args, _context) {
                const sessionId = parent.sessionId;
                return Session_1.Session.findOne({ where: { SessionID: sessionId } });
            },
        });
        t.nonNull.string("allocatedTV");
        t.nonNull.string("userName");
        t.nonNull.int("numberOfSessions");
        t.nonNull.field("Status", {
            type: BookingStatusEnum,
        });
    },
});
exports.BookingTypeDef = BookingTypeDef;
const QueryAllBookings = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.list.field("allBookings", {
            type: "Booking",
            resolve(_parent, _args, ctx) {
                return ctx.prisma.booking.findMany();
            },
        });
    },
});
exports.QueryAllBookings = QueryAllBookings;
const QueryBookingById = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.field("bookingById", {
            type: "Booking",
            args: { bookingID: "Int" },
            resolve(_parent, args, ctx) {
                return ctx.prisma.booking.findOne({
                    where: { BookingID: args.bookingID },
                });
            },
        });
    },
});
exports.QueryBookingById = QueryBookingById;
//# sourceMappingURL=Booked.js.map