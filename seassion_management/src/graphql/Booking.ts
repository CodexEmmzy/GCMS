import { objectType, extendType, intArg, stringArg, nonNull, enumType } from "nexus";
// import { Session } from "../entities/Session";
import { Context } from "../types/Context";
import { Booking } from "../entities/Booking";
import { BookingStatus } from "../utils/constant";
import { Admin } from "../entities/Admin";


const BookingStatusEnum = enumType({
  name: "BookingStatusEnum",
  members: BookingStatus,
});

export const BookingTypeDef = objectType({
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
      resolve(parent, _args, _context: Context): Promise<Admin | null> {
        return Admin.findOne({ where: { id: parent.creatorId } });
      },
    });
  },
});

export const QueryAllBookings = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allBookings", {
      type: "Booking",
      resolve(_parent, _args, context: Context): Promise<Booking[]> {
        const { dbConnection } = context;

        return dbConnection.query(`SELECT * FROM public."booking";`);
      },
    });
  },
});

export const QueryBookingById = extendType({
  type: "Query",
  definition(t) {
    t.field("bookingById", {
      type: "Booking",
      args: { id: nonNull(intArg()) },
      resolve: async (
        _parent,
        { id },
        context: Context
      ): Promise<Booking | null> => {
        const { adminId } = context;

        if (!adminId) {
          throw new Error("Can't find booking without logging in first");
        }

        const booking = await Booking.findOne({
          where: { BookingID: id },
        });

        return booking;
      },
    });
  },
});

export const CreateBooking = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createBooking", {
      type: "Booking",
      args: {
        userName: nonNull(stringArg()),
        allocatedTV: nonNull(stringArg()),
        numberOfSessions: nonNull(intArg()),
      },
      async resolve(_parent, args, context: Context): Promise<Booking> {
        const { userName, allocatedTV, numberOfSessions } = args;
        const QRCode = `gms_qrcode/${userName}/${allocatedTV}/${numberOfSessions}`;
        const { adminId } = context;
      
        if (!adminId) {
          throw new Error(`Cannot create a booking without logging in first.`);
        }
      
        try {
          const booking = Booking.create({
            userName, 
            allocatedTV,
            numberOfSessions,
            QRCode,
            adminId, 
          });
      
          await booking.save();
      
          return booking; // Return the saved booking instance
        } catch (error) {
          throw new Error("Booking with the same session ID already exists.");
        }
      },
      
    });
  },
});


export const UpdateBooking = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateBooking", {
      type: "Booking",
      args: {
        bookingId: nonNull(intArg()),
        name: stringArg(),
        numberOfSessions: intArg(),
        tvAllocated: stringArg(),
      },
      async resolve(
        _parent,
        { bookingId, name, numberOfSessions, tvAllocated },
        context: Context
      ): Promise<Booking> {

        const { adminId } = context;

        if (!adminId) {
          throw new Error(`Cannot update a booking without logging in first.`);
        }

        // Find the booking by ID
        const booking = await Booking.findOne({ where: { BookingID: bookingId } });

        // If booking not found, throw an error
        if (!booking) {
          throw new Error("Booking not found");
        }

        // Check if the booking status is not active
        if (booking.Status === BookingStatus.ACTIVE) {
          throw new Error("Cannot update booking because it is currently active");
        }

        // Update the booking with the provided parameters
        if (name) {
          booking.userName = name;
        }
        if (numberOfSessions) {
          booking.numberOfSessions = numberOfSessions;
        }
        if (tvAllocated) {
          booking.allocatedTV = tvAllocated;
        }

        // Save the updated booking in the database
        return booking.save();
      },
    });
  },
});

export const DeleteBooking = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteBooking", {
      type: "Booking",
      args: {
        bookingId: nonNull(intArg()),
      },
      async resolve(
        _parent,
        { bookingId },
        context: Context
      ): Promise<Booking> {

        const { adminId } = context;

        if (!adminId) {
          throw new Error(`Cannot delete a booking without logging in first.`);
        }

        // Find the booking by ID
        const booking = await Booking.findOne({ where: { BookingID: bookingId } });

        // If booking not found, throw an error
        if (!booking) {
          throw new Error("Booking not found");
        }

        // Check if the booking status is not active
        if (booking.Status === BookingStatus.ACTIVE) {
          throw new Error("Cannot delete booking because it is currently active");
        }

        // Delete the booking from the database
        await booking.remove();

        return booking;
      },
    });
  },
});

