import React from "react";
import { BOOKED, SEATED, CANCELLED, FINISHED } from "../utils/constants";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";

function ReservationRow({
  reservation,
  buttons,
  reservationDone,
  cancelHandler,
}) {
  formatReservationDate(reservation);
  formatReservationTime(reservation);
  return (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td className="labelFirstName">{reservation.first_name}</td>
      <td className="labelLastName">{reservation.last_name}</td>
      <td className="labelPhoneNumber">{reservation.mobile_number}</td>
      <td className="labelDate">{reservation.reservation_date}</td>
      <td className="labelTime">{reservation.reservation_time}</td>
      <td className="labelSize">{reservation.people}</td>
      <td className="labelStatus">{reservation.status}</td>
      {buttons && (
        <td className="tableButton">
          {reservation.status === BOOKED && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
            >
              <a
                href={`/reservations/${reservation.reservation_id}/edit`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Edit
              </a>
            </button>
          )}
        </td>
      )}
      {buttons && (
        <td className="tableButton">
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
        </td>
      )}
      {buttons && (
        <td className="tableButton">
          {reservation.status === BOOKED && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
            >
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Seat
              </a>
            </button>
          )}
        </td>
      )}
      {buttons && (
        <td className="tableButton">
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
        </td>
      )}
    </tr>
  );
}

export default ReservationRow;
