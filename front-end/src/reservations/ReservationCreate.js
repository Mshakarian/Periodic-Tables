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
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setReservation((previousRes) => ({
      ...previousRes,
      [name]: name === "people" ? +value : value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    // let createForm = document.getElementById('createForm');
    // let formData = new FormData(createForm);
    // formData.forEach(({name,value}) =>{
    //   setReservation((previousRes) => ({
    //     ...previousRes,
    //     [name]: name === "people" ? +value : value,
    //   }));
    // })
    console.log("reservation", reservation);
    createReservation(reservation)
      .then(() => {
        setDate(reservation.reservation_date);
        history.push("/");
      })
      .catch(setError);
  }

  function cancelHandler() {
    history.push("/");
  }

  return (
    <main>
      <h1>Create Reservation</h1>
      <ErrorAlert error={error} />
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

export default ReservationCreate;
