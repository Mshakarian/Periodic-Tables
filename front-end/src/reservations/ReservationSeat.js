import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  listTables,
  seatReservation,
  updateReservationStatus,
} from "../utils/api";
import { SEATED, FREE } from "../utils/constants";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams;

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  const [tablesError, setTablesError] = useState(null);

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

  function cancelHandler() {
    history.push("/");
  }

  function changeHandler({ target: { name, value } }) {
    console.log("value", value);
    setSelectedTable(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    seatReservation(selectedTable, reservation_id)
      .then(updateReservationStatus(reservation_id, SEATED))
      .then(loadTables)
      .then(() => history.push("/"))
      .catch(setTablesError);
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

  return (
    <main>
      <h1 className="mb-3">Seat Reservation</h1>
      <ErrorAlert error={tablesError} />
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
