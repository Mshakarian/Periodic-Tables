import React, { useEffect, useState } from "react";
import {
  listReservations,
  updateReservationStatus,
  listTables,
  finishTable,
  deleteReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import { CANCELLED, FINISHED } from "../utils/constants";
import ReservationsList from "./ReservationsList";
//import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate, tables, setTables }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    Promise.all([
      listReservations({ date }, abortController.signal),
      listTables(abortController.signal),
    ])
      .then(([reservationData, tableData]) => {
        setReservations(reservationData);
        console.log("reservationData", reservationData);
        setTables(
          tableData.map((table) => ({
            ...table,
            status: table.status === null ? "free" : table.status,
          }))
        );
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function cancelHandler(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? WARNING: THIS CANNOT BE UNDONE"
      )
    ) {
      updateReservationStatus(reservation_id, CANCELLED)
        .then(loadDashboard)
        .catch(setReservationsError);
    }
  }

  function finishTableHandler(table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? WARNING: THIS CANNOT BE UNDONE"
      )
    ) {
      finishTable(table_id).then(loadDashboard).catch(setReservationsError);
    }
  }

  function reservationDone(reservation_id) {
    if (
      window.confirm(
        "Is this reservation finished? WARNING: THIS CANNOT BE UNDONE"
      )
    ) {
      Promise.all([
        updateReservationStatus(reservation_id, FINISHED),
        deleteReservation(reservation_id),
      ])
        .then(history.push("/"))
        .then(loadDashboard)
        .catch(setReservationsError);
      window.location.reload();
    }
  }

  const tablesTable = tables
    .sort((a, b) =>
      a.table_name > b.table_name ? 1 : b.table_name > a.table_name ? -1 : 0
    )
    .map((table) => {
      let tableRes = reservations.find(reservation => reservation.reservation_id === table.reservation_id);
      console.log("🚀 ~ file: Dashboard.js ~ line 96 ~ .map ~ tableRes", tableRes)
      let partyName = tableRes ? tableRes.last_name : null;
      console.log("🚀 ~ file: Dashboard.js ~ line 98 ~ .map ~ partyName", partyName)
      
      return (
      <tr key={table.table_id}>
        <td>{table.table_id}</td>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.status} - {partyName}</td>
        <td>
          {table.status === "occupied" && (
            <button
              type="button"
              style={{ backgroundColor: "#211A1E" }}
              className="btn btn-secondary mr-1 mb-2 btn-sm"
              data-table-id-finish={table.table_id}
              onClick={() => finishTableHandler(table.table_id)}
            >
              Finish
            </button>
          )}
        </td>
      </tr>
      )
    });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
      </div>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setDate(previous(date))}
        >
          &lt; Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setDate(today())}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setDate(next(date))}
        >
          Next &gt;
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length > 0 && (
        <ReservationsList
          reservations={reservations}
          reservationDone={reservationDone}
          cancelHandler={cancelHandler}
          buttons
        />
      )}
      <div className="table-responsive">
        <table className="table-no-wrap col-6">
          <thead>
            <tr>
              <th className="border-top-0">#</th>
              <th className="border-top-0">Table Name</th>
              <th className="border-top-0">Capacity</th>
              <th className="border-top-0">Status - Party Name</th>
              <th className="border-top-0"></th>
            </tr>
          </thead>
          <tbody>{tablesTable}</tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
