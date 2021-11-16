const OCCUPIED = "occupied";
const FREE = "free";
const BOOKED = "booked";
const CANCELLED = "cancelled"
const SEATED = "seated";
const FINISHED = "finished";

const validStatus = [OCCUPIED,FREE,BOOKED,CANCELLED,SEATED,FINISHED]

module.exports = {
  FREE,
  OCCUPIED,
  BOOKED,
  CANCELLED,
  SEATED,
  FINISHED,
  validStatus,
};