import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function ReservationCreate({ setDate }) {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked",
  };

  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [reservation, setReservation] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setReservation((previousRes) => ({
      ...previousRes,
      [name]: name === "people" ? Number(value) : value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const foundErrors = [];
    console.log("reservation", reservation);
    console.log("reservation json", JSON.stringify({ data: reservation }));
    if (validateDate(foundErrors) && validateFields(foundErrors)) {
      createReservation(reservation, abortController.signal)
        .then(setDate(reservation.reservation_date))
        .then(() => history.push(`/`))
        .catch(setApiError);
    }
    setErrors(foundErrors);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.push("/dashboard");
  }

  /** checks if user has filled out each field in the form */
  function validateFields(foundErrors) {
    for (const field in reservation) {
      if (reservation[field] === "") {
        foundErrors.push({
          message: `${field.split("_").join(" ")} cannot be left blank.`,
        });
      }
    }

    return foundErrors.length === 0;
  }
  /** checks that the user has entered a date & time that the restaurant is available */
  function validateDate(foundErrors) {
    const reservationDateTime = new Date(
      `${reservation.reservation_date}T${reservation.reservation_time}:00.000`
    );
    const todaysDate = new Date();
    if (reservationDateTime.getDay() === 2) {
      foundErrors.push({
        message: "invalid date: restaurant is closed on tuesdays.",
      });
    }

    if (reservationDateTime < todaysDate) {
      foundErrors.push({
        message: "invalid date: only reservations for future dates can be made",
      });
    }

    if (
      reservationDateTime.getHours() < 10 ||
      (reservationDateTime.getHours() === 10 &&
        reservationDateTime.getMinutes() < 30)
    ) {
      foundErrors.push({
        message: "invalid time: restaurant does not open until 10:30am",
      });
    } else if (
      reservationDateTime.getHours() > 22 ||
      (reservationDateTime.getHours() === 22 &&
        reservationDateTime.getMinutes() >= 30)
    ) {
      foundErrors.push({
        message: "invalid time: restaurant closes at 10:30pm",
      });
    } else if (
      reservationDateTime.getHours() > 21 ||
      (reservationDateTime.getHours() === 21 &&
        reservationDateTime.getMinutes() > 30)
    ) {
      foundErrors.push({
        message:
          "invalid time: reservation must be made at least an hour before closing",
      });
    }
    return foundErrors.length === 0;
  }

  const errorsJSX = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  return (
    <main>
      <h1>Create Reservation</h1>
      {errorsJSX()}
      <ErrorAlert error={apiError} />
      <form onSubmit={submitHandler} className="mb-4" id="createForm">
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
              onChange={changeHandler}
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              className="form-control"
              value={reservation.last_name}
              required={true}
              placeholder="Last Name"
              onChange={changeHandler}
            />
          </div>
          <div className="col-6 form-group">
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
              onChange={changeHandler}
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              type="date"
              id="reservationDate"
              name="reservation_date"
              className="form-control"
              value={reservation.reservation_date}
              required={true}
              placeholder="Reservation Date"
              onChange={changeHandler}
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              type="time"
              id="reservationTime"
              name="reservation_time"
              className="form-control"
              value={reservation.reservation_time}
              required={true}
              placeholder="Reservation Time"
              onChange={changeHandler}
            />
          </div>
          <div className="col-6 form-group">
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
              onChange={changeHandler}
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
            type="submit"
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

export default ReservationCreate;
