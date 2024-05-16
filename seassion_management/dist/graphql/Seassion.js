"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartSession = exports.QueryAllSession = exports.SessionType = void 0;
const nexus_1 = require("nexus");
const constant_1 = require("../utils/constant");
const Booking_1 = require("../entities/Booking");
const Session_1 = require("../entities/Session");
const SeassionStatusEnum = (0, nexus_1.enumType)({
    name: "SeassionStatusEnum",
    members: constant_1.SeassionStatus,
});
exports.SessionType = (0, nexus_1.objectType)({
    name: "Session",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.int("timeRemaining");
        t.nonNull.field("Status", {
            type: SeassionStatusEnum,
        });
        t.nonNull.int("bookingId");
        t.nonNull.list.field("bookings", {
            type: "Booking",
            resolve(parent, _args, _ctx) {
                const bookingId = parent.bookingId;
                return Booking_1.Booking.findOne({ where: { BookingID: bookingId } });
            },
        });
    },
});
exports.QueryAllSession = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("allSession", {
            type: "Session",
            resolve(_parent, _args, context) {
                const { dbConnection } = context;
                return dbConnection.query(`SELECT * FROM public."booking";`);
            },
        });
    },
});
exports.StartSession = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.field("startSession", {
            type: "Session",
            args: {
                bookingId: (0, nexus_1.intArg)(),
            },
            async resolve(_parent, { bookingId }, _ctx) {
                const booking = await Booking_1.Booking.findOne(bookingId);
                if (!booking) {
                    throw new Error("Booking not found");
                }
                const session = await Session_1.Session.findOne({ where: { booking: booking } });
                if (!session) {
                    throw new Error("Session not found for this booking");
                }
                session.Status = constant_1.SeassionStatus.START;
                const startTime = new Date(session.startTime);
                const duration = booking.numberOfSessions * 15 * 60 * 1000;
                const endTime = new Date(startTime.getTime() + duration);
                session.endTime = endTime;
                const currentTime = new Date();
                const timeRemaining = endTime.getTime() - currentTime.getTime();
                await session.save();
                const updateRemainingTime = async () => {
                    const currentTime = new Date();
                    const timeRemaining = endTime.getTime() - currentTime.getTime();
                    if (timeRemaining <= 0) {
                        session.Status = constant_1.SeassionStatus.ENDED;
                        await session.save();
                    }
                    else {
                        session.timeRemaining = timeRemaining;
                        await session.save();
                        setTimeout(updateRemainingTime, 1000);
                    }
                };
                updateRemainingTime();
                return Object.assign(Object.assign({}, session), { timeRemaining });
            },
        });
    },
});
//# sourceMappingURL=Seassion.js.map