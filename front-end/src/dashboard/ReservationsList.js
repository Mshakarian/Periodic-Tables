import React from "react";
import { FINISHED, CANCELLED } from "../utils/constants";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import ReservationCard from "./ReservationCard";

function ReservationsList({ reservations, cancelHandler }) {
  const reservationsList = reservations
    .sort((a, b) =>
      a.reservation_time > b.reservation_time
        ? 1
        : b.reservation_time > a.reservation_time
        ? -1
        : 0
    )
    .sort((a, b) =>
      a.last_name > b.last_name
        ? 1
        : b.reservation_time > a.reservation_time
        ? -1
        : 0
    )
    .map((reservation) => {
      if (reservation.status === FINISHED || reservation.status === CANCELLED)
        return null;

      formatReservationDate(reservation);
      formatReservationTime(reservation);

      return (
        <ReservationCard
          key={reservation.reservation_id}
          reservation={reservation}
          cancelHandler={cancelHandler}
          buttons
        />
      );
    });
  if (reservations.length < 1) {
    return (
      <div>
        <h3>No Reservations Found</h3>
        <br />
        <br />
      </div>
    );
  }
  return <div className="row res-card-container">{reservationsList}</div>;
}

export default ReservationsList;
