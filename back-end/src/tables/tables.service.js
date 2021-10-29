const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables").insert(newTable).returning("*");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function update(reservation_id, table_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: "seated" })
    .then(() =>
      knex("tables")
        .where({ table_id })
        .update({ 
          reservation_id: reservation_id,
          status: "occupied"
         }, [
          "table_id",
          "table_name",
          "capacity",
          "reservation_id",
          "status",
        ])
        .then((result) => result[0].status)
    );
}

function finishTable(reservation_id, table_id) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: "finished" })
    .returning("*")
    .then(() => {
      return knex("tables")
        .where({ table_id })
        .update({ reservation_id: null,
        status: "free" });
    });
}

module.exports = {
  list,
  create,
  read,
  update,
  finishTable,
};
