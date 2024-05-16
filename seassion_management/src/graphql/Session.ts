import { objectType, enumType, extendType, intArg, nonNull } from "nexus";
import { Context } from "../types/Context";
import { BookingStatus, SeassionStatus } from "../utils/constant";
import { Booking } from "../entities/Booking";
import { Session } from "../entities/Session";

type NodeJS =  any;

const SeassionStatusEnum = enumType({
  name: "SeassionStatusEnum",
  members: SeassionStatus,
});

export const SessionType = objectType({
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
        return Booking.findOne({ where: { BookingID: parent.bookingId } });
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

export const QueryAllSession = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allSession", {
      type: "Session",
      resolve(_parent, _args, context: Context): Promise<Session[]> {
        const { dbConnection } = context;

        return dbConnection.query(`SELECT * FROM public."session";`);
      },
    });
  },
});

export const QuerysessionById = extendType({
  type: "Query",
  definition(t) {
    t.field("findSessionById", {
      type: "Session",
      args: { id: nonNull(intArg()) },
      resolve: async (
        _parent,
        { id },
        _ctx: Context
      ): Promise<Session | null> => {
        const session = await Session.findOne({
          where: { id },
        });

        return session;
      },
    });
  },
});

export const StartSession = extendType({
  type: "Mutation",
  definition(t) {
    t.field("startSession", {
      type: "Session",
      args: {
        bookingId: nonNull(intArg()),
      },
      async resolve(_parent, { bookingId }, _ctx: Context): Promise<Session> {
        // Find existing session associated with the booking
        let session = await Session.findOne({ where: { bookingId } });

        // If session exists and is paused, resume it
        if (session && session.Status === SeassionStatus.PAUSED) {
          session.Status = SeassionStatus.START; // Resume session
          await session.save();

          // Update booking status to active
          const booking = await Booking.findOneOrFail({
            where: { BookingID: bookingId },
          });
          booking.Status = BookingStatus.ACTIVE;
          await booking.save();

          // Start or resume countdown timer
          startCountdownTimer(session);

          return session;
        }

        // If session exists and is ended, throw an error
        if (session && session.Status === SeassionStatus.ENDED) {
          throw new Error("Session has already ended");
        }

        // If a session already exists for the booking, throw an error
        if (session) {
          throw new Error(
            "A session has already been started for this booking"
          );
        }

        // Find the booking
        const booking = await Booking.findOneOrFail({
          where: { BookingID: bookingId },
        });

        // Update booking status to active
        booking.Status = BookingStatus.ACTIVE;
        await booking.save();

        // Calculate end time based on start time and duration
        const startTime = new Date();
        const duration = booking.numberOfSessions * 15 * 60 * 1000; // Assuming 1 session = 15 minutes
        const endTime = new Date(startTime.getTime() + duration);

        // Create a new session associated with the booking
        session = Session.create({
          startTime,
          endTime,
          bookingId,
          Status: SeassionStatus.START,
          timeRemaining: duration,
          
        });

        // Save the new session in the database
        await session.save();

        // Start countdown timer
        startCountdownTimer(session);

        return session;
      },
    });
  },
});

// Global object to store timers
const sessionTimers: Record<number, NodeJS> = {};



// Function to start countdown timer for a session
function startCountdownTimer(session: Session): void {
  const updateRemainingTime = async () => {
    const currentTimeStamp = Date.now();

    if (session.Status !== SeassionStatus.PAUSED) {
      const remainingTime = session.endTime.getTime() - currentTimeStamp;
      if (remainingTime <= 0) {
        session.Status = SeassionStatus.ENDED;
        session.timeRemaining = 0;

        const booking = await Booking.findOneOrFail({
          where: { BookingID: session.bookingId },
        });
        booking.Status = BookingStatus.UNACTIVE;
        await booking.save();
      } else {
        session.Status = SeassionStatus.START;
        session.timeRemaining = remainingTime;
      }

      await session.save();

      sessionTimers[session.id] = setTimeout(updateRemainingTime, 1000);
    }
  };

  updateRemainingTime();
}

// Function to pause countdown timer for a session
function pauseCountdownTimer(session: Session): void {
  clearTimeout(sessionTimers[session.id]);
  session.Status = SeassionStatus.PAUSED;
  session.save();
}


export const PauseSession = extendType({
  type: "Mutation",
  definition(t) {
    t.field("pauseSession", {
      type: "Session",
      args: {
        sessionId: nonNull(intArg()),
        bookingId: nonNull(intArg()),
      },
      async resolve(
        _parent,
        { sessionId, bookingId },
        context: Context
      ): Promise<Session | null> {

        const { adminId } = context;

        if (!adminId) {
          throw new Error("Can't find booking without logging in first");
        }

        // Find the session by ID
        const session = await Session.findOne({ where: { id: sessionId } });

        // If session not found, throw an error
        if (!session) {
          throw new Error("Session not found");
        }

        // Check if the session is already paused
        if (session.Status === SeassionStatus.PAUSED) {
          throw new Error("Session is already paused");
        }

        if (session.Status === SeassionStatus.ENDED) {
          throw new Error("Session is already eneded");
        }

        // Find the booking
        const booking = await Booking.findOne({
          where: { BookingID: bookingId },
        });

        // If booking not found, throw an error
        if (!booking) {
          throw new Error("Booking not found");
        }

        // Update booking status to active
        booking.Status = BookingStatus.UNACTIVE;

        pauseCountdownTimer(session);

        // Stop the countdown timer (if implemented)
        session.save();
        // Save the updated session in the database
        await booking.save();

        return session;
      },
    });
  },
});
