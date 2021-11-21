import React from "react";
import { Link, useHistory } from "react-router-dom";
import { BOOKED, CANCELLED } from "../utils/constants";
import {updateReservationStatus} from "../utils/api"

function ReservationCard({reservation}) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    reservation_date,
    people,
    status,
  } = reservation;
  
  const history = useHistory();

  function cancelHandler() {
    if (
     window.confirm(
        "Do you want to cancel this reservation? WARNING: THIS CANNOT BE UNDONE"
      )
     ) {
       const abortController = new AbortController();

        updateReservationStatus(reservation_id, CANCELLED, abortController.signal)
         .then(()=> history.push("/"));
      }
    };

  return (
    <div className="mx-auto col-lg-4 col-xl-3 m-3 card text-dark">
      <h3>{reservation_date}</h3>
      <h4>
        {" "}
        Name: {last_name}, {first_name}
      </h4>
      <h5>Phone Number: {mobile_number}</h5>
      <h5>Time: {reservation_time}</h5>
      <h5>Party Size: {people}</h5>
      <br />
      <h5 data-reservation-id-status={reservation.reservation_id}>Status: {status} </h5>
      {status === BOOKED ? (
        <div>
          <button
            type="button"
            className="btn btn-danger mr-1 mb-2 btn-sm text-dark"
            data-reservation-id-cancel={reservation_id}
            id={reservation_id}
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-warning mr-1 mb-2 btn-sm"
           >
            <Link
              to={`/reservations/${reservation_id}/edit`}
              href={`/reservations/${reservation_id}/edit`}
              className="text-dark"
            >
            Edit
            </Link>
          </button>
          <button
            type="button"
            className="btn btn-success mr-1 mb-2 btn-sm"
          >
            <Link
              to={`/reservations/${reservation_id}/seat`}
              href={`/reservations/${reservation_id}/seat`}
              className="text-dark"
            >
              Seat
            </Link>
          </button>
        </div>
      ) : (
            <>{null}</>
          )
    }
    </div>
  );
}

export default ReservationCard;
