"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseSession = exports.StartSession = exports.QuerysessionById = exports.QueryAllSession = exports.SessionType = void 0;
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
        t.nonNull.field("booking", {
            type: "Booking",
            resolve(parent, _args, _ctx) {
                return Booking_1.Booking.findOne({ where: { BookingID: parent.bookingId } });
            },
        });
        t.nonNull.field("startTime", {
            type: "String",
            resolve(parent) {
                const start_date = new Date(parent.startTime);
                return start_date.toUTCString();
            },
        });
        t.nonNull.field("endTime", {
            type: "String",
            resolve(parent) {
                const end_date = new Date(parent.endTime);
                return end_date.toUTCString();
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
                return dbConnection.query(`SELECT * FROM public."session";`);
            },
        });
    },
});
exports.QuerysessionById = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.field("findSessionById", {
            type: "Session",
            args: { id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()) },
            resolve: async (_parent, { id }, _ctx) => {
                const session = await Session_1.Session.findOne({
                    where: { id },
                });
                return session;
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
                bookingId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            async resolve(_parent, { bookingId }, _ctx) {
                let session = await Session_1.Session.findOne({ where: { bookingId } });
                if (session && session.Status === constant_1.SeassionStatus.PAUSED) {
                    session.Status = constant_1.SeassionStatus.START;
                    await session.save();
                    const booking = await Booking_1.Booking.findOneOrFail({
                        where: { BookingID: bookingId },
                    });
                    booking.Status = constant_1.BookingStatus.ACTIVE;
                    await booking.save();
                    startCountdownTimer(session);
                    return session;
                }
                if (session && session.Status === constant_1.SeassionStatus.ENDED) {
                    throw new Error("Session has already ended");
                }
                if (session) {
                    throw new Error("A session has already been started for this booking");
                }
                const booking = await Booking_1.Booking.findOneOrFail({
                    where: { BookingID: bookingId },
                });
                booking.Status = constant_1.BookingStatus.ACTIVE;
                await booking.save();
                const startTime = new Date();
                const duration = booking.numberOfSessions * 15 * 60 * 1000;
                const endTime = new Date(startTime.getTime() + duration);
                session = Session_1.Session.create({
                    startTime,
                    endTime,
                    bookingId,
                    Status: constant_1.SeassionStatus.START,
                    timeRemaining: duration,
                });
                await session.save();
                startCountdownTimer(session);
                return session;
            },
        });
    },
});
const sessionTimers = {};
function startCountdownTimer(session) {
    const updateRemainingTime = async () => {
        const currentTimeStamp = Date.now();
        if (session.Status !== constant_1.SeassionStatus.PAUSED) {
            const remainingTime = session.endTime.getTime() - currentTimeStamp;
            if (remainingTime <= 0) {
                session.Status = constant_1.SeassionStatus.ENDED;
                session.timeRemaining = 0;
                const booking = await Booking_1.Booking.findOneOrFail({
                    where: { BookingID: session.bookingId },
                });
                booking.Status = constant_1.BookingStatus.UNACTIVE;
                await booking.save();
            }
            else {
                session.Status = constant_1.SeassionStatus.START;
                session.timeRemaining = remainingTime;
            }
            await session.save();
            sessionTimers[session.id] = setTimeout(updateRemainingTime, 1000);
        }
    };
    updateRemainingTime();
}
function pauseCountdownTimer(session) {
    clearTimeout(sessionTimers[session.id]);
    session.Status = constant_1.SeassionStatus.PAUSED;
    session.save();
}
exports.PauseSession = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.field("pauseSession", {
            type: "Session",
            args: {
                sessionId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                bookingId: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            async resolve(_parent, { sessionId, bookingId }, context) {
                const { adminId } = context;
                if (!adminId) {
                    throw new Error("Can't find booking without logging in first");
                }
                const session = await Session_1.Session.findOne({ where: { id: sessionId } });
                if (!session) {
                    throw new Error("Session not found");
                }
                if (session.Status === constant_1.SeassionStatus.PAUSED) {
                    throw new Error("Session is already paused");
                }
                if (session.Status === constant_1.SeassionStatus.ENDED) {
                    throw new Error("Session is already eneded");
                }
                const booking = await Booking_1.Booking.findOne({
                    where: { BookingID: bookingId },
                });
                if (!booking) {
                    throw new Error("Booking not found");
                }
                booking.Status = constant_1.BookingStatus.UNACTIVE;
                pauseCountdownTimer(session);
                session.save();
                await booking.save();
                return session;
            },
        });
    },
});
//# sourceMappingURL=Session.js.map