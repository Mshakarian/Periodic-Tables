import React from "react";
import { Link } from "react-router-dom";
import {BOOKED, FINISHED, CANCELLED, SEATED} from "../utils/constants"
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
//import ReservationCard from "./ReservationCard";

function ReservationsList({
  reservations,
  reservationDone,
  cancelHandler,
}) {
  const reservationsList = reservations
    .sort((a, b) =>
      a.reservation_time > b.reservation_time
        ? 1
        : b.reservation_time > a.reservation_time
        ? -1
        : 0
    ).sort((a,b) =>
    a.last_name > b.last_name
        ? 1
        : b.reservation_time > a.reservation_time
        ? -1
        : 0 )
    .map((reservation) => {
    if (reservation.status === FINISHED || reservation.status === CANCELLED)
    return null;

  formatReservationDate(reservation);
  formatReservationTime(reservation);

  return ( 
    <div className="col-lg-4 col-xl-3 m-3 reservation-card text-black" key={reservation.reservation_id}>
      <h3>{reservation.reservation_date}</h3>
      <h4> Name: {reservation.last_name}, {reservation.first_name}</h4>
      <h5>Phone Number: {reservation.mobile_number}</h5>
      <h5>Time: {reservation.reservation_time}</h5>
      <h5>Party Size: {reservation.people}</h5>
      <br />
      <h5>Status: {reservation.status}</h5>
        <div>
          {reservation.status === BOOKED && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
            >
              <Link
                to={`/reservations/${reservation.reservation_id}/edit`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Edit
              </Link>
            </button>
          )}
          {reservation.status !== CANCELLED && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => cancelHandler(reservation.reservation_id)}
            >
              Cancel
            </button>
          )}
          {reservation.status === BOOKED && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
            >
              <Link
                to={`/reservations/${reservation.reservation_id}/seat`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Seat
              </Link>
            </button>
          )}
          {(reservation.status === SEATED ||
            reservation.status === CANCELLED ||
            reservation.status === FINISHED) && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
              onClick={() => reservationDone(reservation.reservation_id)}
            >
              Done
            </button>
          )}
        </div>
    </div>)
    })
    if( reservations.length < 1 ){
      return (
        <div>
          <h3>No Reservations Found</h3>
          <br />
          <br />
        </div>
      )
    }
  return (
    <div className="row res-card-container">
      {reservationsList}
    </div>
  );
}

export default ReservationsList;
