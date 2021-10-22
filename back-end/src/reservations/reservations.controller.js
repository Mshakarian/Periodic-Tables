const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reservationFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function propertiesAreDefined(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({ status: 400, message: "No Reservation Data Provided" });
  }
  reservationFields.forEach((key) => {
    if (!data[key]) {
      return next({
        status: 400,
        message: `Reservation must include a ${key} field`,
      });
    }
  });
  const { reservationTimeString, reservationDateString } = data; // "16:59:00"
  const reservationString = `${reservationTimeString}T${reservationDateString}:00`;
  res.locals.dateTimeString = reservationString;

  reservationFields.forEach((key) => {
    if (key === "people" && (typeof data[key] !== "number" || data[key] < 1)) {
      return next({ status: 400, message: "Party must be greater than 0" });
    } else if (
      key === "reservation_date" &&
      new Date(data.reservation_date).toDateString() === "Invalid Date"
    ) {
      return next({
        status: 400,
        message: "Reservation must include a valid Date",
      });
    } else if (key === "reservation_time") {
      const reservationTime = data[key];
      const timeArray = reservationTime.split(":");
      if (
        timeArray.length !== 2 ||
        isNaN(timeArray[0]) ||
        isNaN(timeArray[1])
      ) {
        return next({
          status: 400,
          message: "Reservation must include a valid Time",
        });
      }
    }
  });

  return next();
}

function checkDayofWeek(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservationString = `${reservation_date}T${reservation_time}:00`;
  res.locals.dateTimeString = reservationString;
  const reservationDate = new Date(reservationString);
  if (reservationDate.getDay() !== 2) {
    return next();
  }
  return next({
    status: 400,
    message:
      "This Restaurant is closed on Tuesdays, please choose a different day",
  });
}

function restaurantOpen(req, next) {
  const reservationTimeString = req.body.data.reservation_time;
  const reservationDateString = req.body.data.reservation_date;

  const earliestTimeArray = [10, 30, 0];
  const latestTimeArray = [21, 30, 0];

  const dateTimeString = `${reservationDateString}T${reservationTimeString}:00`;
  const earliestTime = new Date(dateTimeString);
  earliestTime.setHours(...earliestTimeArray);
  const latestTime = new Date(dateTimeString);
  latestTime.setHours(...latestTimeArray);
  const reservation = new Date(dateTimeString);
  const now = new Date();

  if (reservation >= earliestTime && reservation <= latestTime) {
    return next();
  }
  return next({
    status: 400,
    message:
      "This Restaurant is open between 10:30AM & 9:30PM, please select a valid time",
  });
}

function dateInFuture(req, next) {
  const now = new Date();
  const reservation = new Date(res.locals.dateTimeString);
  if (reservation > now) {
    return next();
  }
  return next({
    status: 400,
    message: "This isn't a DeLorean, please select a date in the future.",
  });
}

async function list(req, res, next) {
  const data = await service.list(req.query);
  const filteredData = data.filter(
    (reservation) => reservation.status !== "finished"
  );
  if (req.query.mobile_number && data.length === 0) {
    return next({
      status: 404,
      message: "No Reservation found matching Mobile Number, Check Number.",
    });
  } else {
    return res.json({ data });
  }
  res.json({ filteredData });
}

async function create(req, res, next) {
  const date = new Date(req.body.data.reservation_date);
  const reservationStrings = res.locals.dateTimeString.split("T");
  const reservationDate = reservationStrings[0];
  const reservationTime = reservationStrings[1];

  const newReservation = await service.create({
    ...req.body.data,
    reservation_date: date.toUTCString(),
  });

  if (newReservation[0].status !== "booked") {
    return next({ status: 400, message: newReservation[0].status });
  }
  res.status(201).json({
    data: [
      {
        ...newReservation[0],
        reservation_date: reservationDate,
        reservation_time: reservationTime,
      },
    ],
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(req.params.reservation_id);
  if (reservation.length === 1) {
    res.locals.reservations = reservation;
    return next();
  }
  return next({ status: 404, message: `${req.params.reservation_id}` });
}

async function readReservation(req, res, next) {
  const data = await service.readReservation(
    Number(res.locals.reservations[0].reservation_id)
  );
  res.json({ data });
}

async function destroyReservation(req, res) {
  const data = await service.destroy(res.locals.reservations[0].reservation_id);
  res.status(204).json({ data });
}

function updateReservationValidation(req, res, next) {
  const reservation = req.body.data;

  if (!reservation.first_name || reservation.first_name === "") {
    return next({ status: 400, message: "first_name" });
  }
  if (!reservation.last_name || reservation.last_name === "") {
    return next({ status: 400, message: "last_name" });
  }
  if (!reservation.mobile_number || reservation.mobile_number === "") {
    return next({ status: 400, message: "mobile_number" });
  }
  if (
    !reservation.reservation_date ||
    reservation.reservation_date === "" ||
    reservation.reservation_date === "not-a-date"
  ) {
    return next({ status: 400, message: "reservation_date" });
  }
  if (
    !reservation.reservation_time ||
    reservation.reservation_time === "" ||
    reservation.reservation_time === "not-a-time"
  ) {
    return next({ status: 400, message: "reservation_time" });
  }
  if (
    !reservation.people ||
    reservation.people === "" ||
    typeof reservation.people === "string"
  ) {
    return next({ status: 400, message: "people" });
  }
  return next();
}

async function updateReservation(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservations[0].reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function updateStatus(req, res, next) {
  const reservation = res.locals.reservations[0];
  console.log("reservation: ", reservation);
  console.log("request: ", req.body);
  const updatedReservation = {
    ...reservation,
    status: req.body.status,
  };

  if (updatedReservation.status === "unknown") {
    return next({ status: 400, message: "unknown" });
  } else if (updatedReservation.status === "finished") {
    return next({ status: 400, message: "finished" });
  } else {
    const data = await service.update(updatedReservation);

    res.status(200).json({ data: { status: data[0].status } });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    propertiesAreDefined,
    checkDayofWeek,
    restaurantOpen,
    dateInFuture,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(readReservation),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    updateReservationValidation,
    asyncErrorBoundary(updateReservation),
  ],
  delete: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroyReservation),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
};
