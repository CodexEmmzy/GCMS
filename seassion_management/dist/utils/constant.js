"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saltRound = exports.BookingStatus = exports.SeassionStatus = void 0;
var SeassionStatus;
(function (SeassionStatus) {
    SeassionStatus["START"] = "start";
    SeassionStatus["PAUSED"] = "PAUSED";
    SeassionStatus["ENDED"] = "ended";
})(SeassionStatus || (exports.SeassionStatus = SeassionStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["ACTIVE"] = "active";
    BookingStatus["UNACTIVE"] = "unactive";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
exports.saltRound = 10;
//# sourceMappingURL=constant.js.map