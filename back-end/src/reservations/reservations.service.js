const knex = require("../db/connection");
const tableName = "reservations";

function list() {
  return knex(tableName).select("*").whereNot("status", ["finished","cancelled"]).orderBy("reservation_time");
}

function listByDate(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listByPhone(mobile_number) {
  return knex(tableName)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .returning("*")
    .orderBy("reservation_date");
}

function create(newReservation) {
  return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((newReservation) => newReservation[0]);
}

function readReservation(reservation_id) {
  return knex(tableName).select("*").where({ reservation_id }).first();
}

function update(updatedReservation, reservation_id) {
  //reservation_id = Number(reservation_id);
  return knex(tableName)
    .where({ reservation_id })
    .update({ ...updatedReservation })
    .returning("*")
    .then((result) => result[0]);
}

function updateReservationStatus(status, reservation_id) {
  return knex(tableName)
    .where({ reservation_id: reservation_id })
    .update({ status: status })
    .returning("*")
    .then((result) => result[0]);
}

module.exports = {
  list,
  listByDate,
  listByPhone,
  create,
  readReservation,
  update,
  updateReservationStatus,
};
