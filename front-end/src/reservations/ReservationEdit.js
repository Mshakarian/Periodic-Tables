import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function ReservationEdit() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "",
  };
  const [reservation, setReservation] = useState(initialState);
  const [reservationError, setReservationError] = useState(null);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }
  useEffect(loadReservation, [reservation_id]);

  function changeHandler({ target: { name, value } }) {
    setReservation({
      ...reservation,
      [name]: name === "people" ? Number(value) : value,
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    updateReservation(reservation).then(() => setReservation(reservation));
    history.push("/");
    window.location.reload();
  }

  function cancelHandler() {
    history.push("/");
  }

  const child = reservation.reservation_id ? (
    <ReservationForm
      reservation={reservation}
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      changeHandler={changeHandler}
    />
  ) : (
    <p>Loading...</p>
  );

  return (
    <main>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={reservationError} />
      {child}
    </main>
  );
}

export default ReservationEdit;
