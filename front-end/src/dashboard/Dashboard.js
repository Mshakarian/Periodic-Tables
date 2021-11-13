import React, { useEffect, useState } from "react";
import {
  listReservations,
  updateReservationStatus,
  listTables,
  finishTable,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { CANCELLED } from "../utils/constants";
import ReservationsList from "./ReservationsList";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate, tables, setTables }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  let queryDate = query.get("date");

  if (queryDate){
    setDate(queryDate);
  }

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

  const tablesCards = () => {
    if(tables !== undefined){
    return tables
    .sort((a, b) =>
      a.table_name > b.table_name ? 1 : b.table_name > a.table_name ? -1 : 0
    )
    .map((table) => {
      let tableRes = reservations.find(reservation => reservation.reservation_id === table.reservation_id);
      let partyName = tableRes ? tableRes.last_name : null;      
      return (
        <div className="col-lg-4 col-xl-3 m-3 card table-card text-black" key={table.table_id} >
          <h5 className="table-card-title">Table: {table.table_name}</h5>
          <div>
            <h5 data-table-id-status={table.table_id}> Status: 
             {table.reservation_id ? " occupied" : " free"}
            </h5>
            <h5>Table Capacity: {table.capacity}</h5>
            {table.reservation_id ? (
            <h4>{partyName} Party</h4>
          ): null}
          </div>
          {table.reservation_id ? (
            <div>
            <button
              data-table-id-finish={table.table_id}
              className="btn btn-success"
              onClick={() => finishTableHandler(table.table_id)}
            >
              Finish
            </button>
            </div>
          ) : null}
          </div>
      )
    })}};

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
          cancelHandler={cancelHandler}
          buttons
        />
      )}
      <div className="row">{tablesCards()}</div>
    </main>
  );
}

export default Dashboard;
