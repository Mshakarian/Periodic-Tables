const knex = require("../db/connection");

function list({ date, mobile_number }) {
  return knex("reservations")
    .select("*")
    .whereNot({ status: "finished" })
    .modify(function (queryBuilder) {
      if (date) {
        queryBuilder.where({ reservation_date: date });
      }
      if (mobile_number) {
        queryBuilder
          .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
          )
          .orderBy("reservation_date");
      }
    })
    .orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((newReservation) => newReservation[0]);
}

function readReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id });
}

function update(updatedReservation, reservation_id) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ ...updatedReservation })
    .returning("*")
    .then((result) => result[0]);
}

function updateReservationStatus(status, reservation_id) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: status })
    .returning("*")
    .then((result) => result[0]);
}

module.exports = {
  list,
  create,
  readReservation,
  update,
  updateReservationStatus,
};
