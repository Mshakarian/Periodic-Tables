import React from "react";
import { FINISHED, CANCELLED } from "../utils/constants";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import ReservationCard from "./ReservationCard";

function ReservationsList({ reservations, cancelHandler, }) {
  if (reservations === undefined || reservations.length === 0) {

    return (
      <div>
        <br />
        <h3>No Reservations Found</h3>
        <br />
      </div>
    );
  }
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

  return <div className="row res-card-container">{reservationsList}</div>;
}

export default ReservationsList;
