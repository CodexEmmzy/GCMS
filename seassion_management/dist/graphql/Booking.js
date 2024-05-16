"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBooking = exports.UpdateBooking = exports.CreateBooking = exports.QueryBookingById = exports.QueryAllBookings = exports.BookingTypeDef = void 0;
const nexus_1 = require("nexus");
const Booking_1 = require("../entities/Booking");
const constant_1 = require("../utils/constant");
const Admin_1 = require("../entities/Admin");
const BookingStatusEnum = (0, nexus_1.enumType)({
    name: "BookingStatusEnum",
    members: constant_1.BookingStatus,
});
exports.BookingTypeDef = (0, nexus_1.objectType)({
    name: "Booking",
    definition(t) {
        t.nonNull.int("BookingID");
        t.nonNull.field("Status", {
            type: BookingStatusEnum,
        });
        t.nonNull.string("allocatedTV");
        t.nonNull.string("QRCode");
        t.nonNull.string("userName");
        t.nonNull.int("numberOfSessions");
        t.nonNull.int("creatorId");
        t.field("createdBy", {
            type: "Admin",
            resolve(parent, _args, _context) {
                return Admin_1.Admin.findOne({ where: { id: parent.creatorId } });
            },
        });
    },
});
exports.QueryAllBookings = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("allBookings", {
            type: "Booking",
            resolve(_parent, _args, context) {
                const { dbConnection } = context;
                return dbConnection.query(`SELECT * FROM public."booking";`);
            },
        });
    },
});
exports.QueryBookingById = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.field("bookingById", {
            type: "Booking",
            args: { id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()) },
            resolve: async (_parent, { id }, context) => {
                const { adminId } = context;
                if (!adminId) {
                    throw new Error("Can't find booking without logging in first");
                }
                const booking = await Booking_1.Booking.findOne({
                    where: { BookingID: id },
                });
                return booking;
            },
        });
    },
});
exports.CreateBooking = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createBooking", {
            type: "Booking",
            args: {
                userName: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                allocatedTV: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                numberOfSessions: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            async resolve(_parent, args, context) {
                const { userName, allocatedTV, numberOfSessions } = args;
                const QRCode = `gms_qrcode/${userName}/${allocatedTV}/${numberOfSessions}`;
                const { adminId } = context;
                if (!adminId) {
                    throw new Error(`Cannot create a booking without logging in first.`);
                }
                try {
                    const booking = Booking_1.Booking.create({
                        userName,
                        allocatedTV,
                        numberOfSessions,
                        QRCode,
                        adminId,
                    });
                    await booking.save();
                    return booking;
                }
                catch (error) {
                    throw new Error("Booking with the same session ID already exists.");
                }
            },
        });
    },
});
exports.UpdateBooking = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateBooking", {
            type: "Booking",
            args: {
                bookingId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                name: (0, nexus_1.stringArg)(),
                numberOfSessions: (0, nexus_1.intArg)(),
                tvAllocated: (0, nexus_1.stringArg)(),
            },
            async resolve(_parent, { bookingId, name, numberOfSessions, tvAllocated }, context) {
                const { adminId } = context;
                if (!adminId) {
                    throw new Error(`Cannot update a booking without logging in first.`);
                }
                const booking = await Booking_1.Booking.findOne({ where: { BookingID: bookingId } });
                if (!booking) {
                    throw new Error("Booking not found");
                }
                if (booking.Status === constant_1.BookingStatus.ACTIVE) {
                    throw new Error("Cannot update booking because it is currently active");
                }
                if (name) {
                    booking.userName = name;
                }
                if (numberOfSessions) {
                    booking.numberOfSessions = numberOfSessions;
                }
                if (tvAllocated) {
                    booking.allocatedTV = tvAllocated;
                }
                return booking.save();
            },
        });
    },
});
exports.DeleteBooking = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deleteBooking", {
            type: "Booking",
            args: {
                bookingId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            async resolve(_parent, { bookingId }, context) {
                const { adminId } = context;
                if (!adminId) {
                    throw new Error(`Cannot delete a booking without logging in first.`);
                }
                const booking = await Booking_1.Booking.findOne({ where: { BookingID: bookingId } });
                if (!booking) {
                    throw new Error("Booking not found");
                }
                if (booking.Status === constant_1.BookingStatus.ACTIVE) {
                    throw new Error("Cannot delete booking because it is currently active");
                }
                await booking.remove();
                return booking;
            },
        });
    },
});
//# sourceMappingURL=Booking.js.map