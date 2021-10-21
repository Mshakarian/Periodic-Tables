const { query } = require("express");
const knex = require("../db/connection");

function list({date,mobile_number}){
    return knex("reservations")
    .select("*")
    .modify(function (queryBuilder){
        if (date){
            queryBuilder.where({reservation_date: date});
        };
        if(mobile_number){
            queryBuilder.whereRaw("translate(mobile_number, '() -', '') like ?", `%${mobile_number.replace(/\D/g, "")}%`)
            .orderBy("reservation_date");
        }
     }).orderBy("reservation_time")
};

function create(newReservation){
    return knex("reservations").insert(newReservation).returning("*");
};

function readReservation(reservationId){
    return knex("reservations").select("*").where({reservation_id: reservationId});
};

function destroy(reservationId){
    return knex("reservations").where({reservation_id:reservationId}).del();
};

function update(updatedReservation){
    return knex("reservations").select("*").where({reservation_id:updatedReservation.reservation_id}).update(updatedReservation, "*");
};

module.exports = {
    list,
    create,
    readReservation,
    destroy,
    update,
}