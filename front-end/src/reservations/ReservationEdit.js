import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";

function ReservationEdit() {
  const history = useHistory();
  const { reservationId } = useParams();
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

  useEffect(loadReservation, [reservationId]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation({ reservationId }, abortController.signal)
      .then((reservationData) => {
        console.log("Reservation Data to Edit: ", reservationData);
        return setReservation(reservationData);
      })
      .catch(setReservationError);
    return () => abortController.abort();
  }

  // function changeHandler({ target: { name, value } }) {
  //   setReservation({
  //     ...reservation,
  //     [name]: name === "people" ? Number(value) : value,
  //   });
  // }

  function submitHandler(event) {
    event.preventDefault();
    let editForm = document.getElementById('reservation-edit');
    let formData = new FormData(editForm);
    formData.forEach(({name,value}) =>{
      setReservation({
        ...reservation,
        [name]: name === "people" ? Number(value) : value,
      });
    })
    updateReservation(reservation).then(() => setReservation(reservation));
    console.log("reservation", reservation);
    history.push("/");
    window.location.reload();
  }

  function cancelHandler() {
    history.push("/");
  }

  return (
    <main>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={reservationError} />
      <form onSubmit={submitHandler} className="reservation-edit">
        <div className="mb-3">
          <div className="col-6 form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              className="form-control"
              value={reservation.first_name}
              required={true}
              placeholder="First Name"
              //onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              className="form-control"
              value={reservation.last_name}
              required={true}
              placeholder="Last Name"
              //onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobile_number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="form-control"
              value={reservation.mobile_number}
              required={true}
              placeholder="Cell Number"
              //onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              type="date"
              id="reservationDate"
              name="reservation_date"
              className="form-control"
              value={reservation.reservation_date}
              required={true}
              placeholder="Reservation Date"
              //onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              type="time"
              id="reservationTime"
              name="reservation_time"
              className="form-control"
              value={reservation.reservation_time}
              required={true}
              placeholder="Reservation Time"
              //onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="people">Party Size</label>
            <input
              type="number"
              min="1"
              id="people"
              name="people"
              className="form-control"
              value={reservation.people}
              required={true}
              placeholder="Party Size"
              //onChange={changeHandler}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            <span className="oi o-x" /> Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={submitHandler}
          >
            <span className="oi oi-check" /> Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReservationEdit;
