import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";



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
        message:
          "invalid date: This isn't a DeLorean, please select a date in the future",
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
      <ReservationForm 
        reservation={reservation}
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
        changeHandler={changeHandler} />
    </main>
  );
}

export default ReservationCreate;
