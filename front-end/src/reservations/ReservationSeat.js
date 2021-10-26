import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  listTables,
  seatReservation,
  updateReservationStatus,
  readReservation,
} from "../utils/api";
import { SEATED, FREE } from "../utils/constants";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../dashboard/ReservationCard";

function ReservationSeat() {
  const history = useHistory();
  let { reservation_id } = useParams();
  reservation_id = Number(reservation_id);
  console.log(
    "🚀 ~ file: ReservationSeat.js ~ line 16 ~ ReservationSeat ~ reservation_id",
    reservation_id
  );

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(tables[0]);
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
      .then((data) => {
        setTables(data);
      })
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
    history.push("/");
  }

  function changeHandler({ target: { name, value } }) {
    console.log("value", value);
    setSelectedTable(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    console.log("submit handler, reservation ID: ", reservation.reservation_id);
    console.log("submit handler selected table: ", selectedTable);
    seatReservation(reservation.reservation_id, selectedTable)
      .then(updateReservationStatus(reservation.reservation_id, SEATED))
      .then(() => history.push("/"));
  }

  const tablesTableRows = tables.map((table) => {
    if (table.status === FREE) {
      return (
        <option value={table.table_id} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    } else {
      return null;
    }
  });
  console.log("tables: ", tables);
  console.log("tables rows: ", tablesTableRows);

  return (
    <main>
      <h1 className="mb-3">Seat Reservation</h1>
      <ErrorAlert error={(tablesError, reservationError)} />
      <ReservationCard reservation={reservation} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="table_id">
              Select a table
            </label>
            <select
              className="form-control"
              id="table_id"
              name="table_id"
              onChange={changeHandler}
              required={true}
            >
              <option>Select a table</option>
              {tablesTableRows}
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
