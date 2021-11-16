const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { OCCUPIED, FREE, FINISHED, SEATED } = require("../constants");
const reservationService = require("../reservations/reservations.service");

//MIDDLEWARE

function bodyHasData(req, res, next) {
  const data = req.body.data;
  if (data) return next();
  next({ status: 400, message: "All fields need valid input" });
}

function bodyHasResId(req, res, next) {
  const { reservation_id } = req.body.data;
  if (reservation_id) return next();
  next({ status: 400, message: "reservation_id is required" });
}

async function tableExists(req, res, next) {
  let { table_id } = req.params;
  table_id = Number(table_id);
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${table_id} does not exist` });
}

async function resExists(req, res, next) {
  let { reservation_id } = req.body.data;
  reservation_id = Number(reservation_id);
  const reservation = await reservationService.readReservation(reservation_id);  
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist`,
  });
}

function tableHasName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name && table_name.length > 1) return next();
  else
    return next({
      status: 400,
      message: "table_name must be 2 characters or more",
    });
}

function tableHasCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity && typeof capacity === "number" && Number(capacity) > 0)
    return next();
  return next({
    status: 400,
    message: "table capacity must be a number greater than 0",
  });
}

function partyFitsTable(req, res, next) {
  let { people } = res.locals.reservation;
  let { capacity } = res.locals.table;  
  if (Number(people) > Number(capacity))
    return next({
      status: 400,
      message: "Table capacity is too small to fit this reservation size",
    });
  next();
}

async function tableIsOccupied(req, res, next) {
  let { table_id } = req.params;
  table_id = Number(table_id);
  const table = await service.read(table_id);
  if (table.reservation_id === null) return next();
  next({ status: 400, message: "This table is already occupied" });
}

async function tableIsUnoccupied(req, res, next) {
  let { table_id } = req.params;
  table_id = Number(table_id);
  const table = await service.read(table_id);
  if (table.reservation_id === null)
    return next({ status: 400, message: "This table is not occupied" });
  next();
}

function reservationSeatedAlready(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === SEATED)
    return next({
      status: 400,
      message:
        "This party is already seated at a different table, please select a different reservation.",
    });
  next();
}

//CRUDL

async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable[0] });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function updateTable(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;
  const data = await service.update(reservation_id, table_id);
  res.json({ data });
}

async function finishTable(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  const data = await service.finishTable(reservation_id, table_id);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyHasData,
    tableHasName,
    tableHasCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    bodyHasData,
    bodyHasResId,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(resExists),
    reservationSeatedAlready,
    asyncErrorBoundary(partyFitsTable),
    asyncErrorBoundary(tableIsOccupied),
    asyncErrorBoundary(updateTable),
  ],
  finishTable: [
    tableExists,
    tableIsUnoccupied,
    asyncErrorBoundary(finishTable),
  ],
};
