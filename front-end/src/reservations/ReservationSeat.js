import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  listTables,
  seatReservation,
  updateReservationStatus,
  readReservation,
} from "../utils/api";
import { SEATED } from "../utils/constants";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../dashboard/ReservationCard";

function ReservationSeat() {
  const history = useHistory();
  let { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("x");
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked",
  });
  const [reservationError, setReservationError] = useState(null);

  useEffect(loadTables, [reservation_id]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then((data) => setReservation(data))
      .catch(setReservationError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  function changeHandler({ target: { value } }) {
    setSelectedTable(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    if(selectedTable !== "x"){
      const abortController = new AbortController();
      seatReservation(reservation_id, parseInt(selectedTable), abortController.signal)
      .then(response => {
        if(!response.message){
          updateReservationStatus(reservation_id, SEATED, abortController.signal)
          history.push(`/dashboard?date=${reservation.reservation_date}`)
        }
      }).catch(setTablesError);
      return () => abortController.abort();
    }
  }

  const tablesOptions = tables.map((table) => {
    if (table.reservation_id === null) {
      return (
        <option value={table.table_id} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    } else {
      return null;
    }
  });

  return (
    <main>
      <h1 className="text-light mb-3">Seat Reservation</h1>
        <ErrorAlert error={reservationError} />
        <ErrorAlert error={tablesError} />
        <ReservationCard reservation={reservation} />
      <form onSubmit={submitHandler} className=" mb-4">
        <div className=" row mb-3">
          <div className="mx-auto col-6 form-group">
            <label className="form-label text-light" htmlFor="table_id">
              Select a table
            </label>
            <select
              className="form-control"
              id="table_id"
              name="table_id"
              onChange={changeHandler}
              required={true}
            >
              <option value="x">Select a table</option>
              {tablesOptions}
            </select>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReservationSeat;
