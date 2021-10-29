import { Link } from "react-router-dom";
import { BOOKED } from "../utils/constants";

function ReservationCard(props) {
  return (
    <div className="col-lg-4 col-xl-3 m-3 reservation-card text-black">
      <h3>{props.reservation.reservation_date}</h3>
      <h4>
        {" "}
        Name: {props.reservation.last_name}, {props.reservation.first_name}
      </h4>
      <h5>Phone Number: {props.reservation.mobile_number}</h5>
      <h5>Time: {props.reservation.reservation_time}</h5>
      <h5>Party Size: {props.reservation.people}</h5>
      <br />
      <h5>Status: {props.reservation.status}</h5>
      {props.buttons && (
        <div>
          {props.reservation.status === BOOKED && (
            <button
              type="button"
              style={{
                backgroundColor: "#211A1E",
              }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
            >
              <Link
                href={`/reservations/${props.reservation.reservation_id}/edit`}
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Edit
              </Link>
            </button>
          )}
          {props.reservation.status === BOOKED && (
            <button
              type="button"
              style={{
                backgroundColor: "#211A1E",
              }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
              data-reservation-id-cancel={props.reservation.reservation_id}
              onClick={() =>
                props.cancelHandler(props.reservation.reservation_id)
              }
            >
              Cancel
            </button>
          )}
          {props.reservation.status === BOOKED && (
            <button
              type="button"
              style={{
                backgroundColor: "#211A1E",
              }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
            >
              <Link
                to={`/reservations/${props.reservation.reservation_id}/seat`}
                href={`/reservations/${props.reservation.reservation_id}/seat`}
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Seat
              </Link>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReservationCard;
