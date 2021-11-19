import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import ReservationsList from "./ReservationsList";
import TableList from "../tables/TableList";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate, tables, setTables }) {
  const history = useHistory();
  const query = useQuery();
  let queryDate = query.get("date");

  if (queryDate){
    setDate(queryDate);
  }
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    Promise.all([
      listReservations({date}, abortController.signal),
      listTables(abortController.signal),
    ])
      .then(([reservationData, tableData]) => {
        setReservations(reservationData);
        setTables(tableData);
      })
      .catch(error => {
        console.error(error);
        setReservationsError(error);
      });
    return () => abortController.abort();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [date]);

  function nextDateClick(){
    setDate(next(date));
    history.push("/");
  };

  function previousDateClick(){
    setDate(previous(date));
    history.push("/");
  };

  function todayDateClick(){
    setDate(today());
    history.push("/");
  };

  return (
    <main>
      <h1 className="text-light">Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={previousDateClick}
        >
          &lt; Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={todayDateClick}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={nextDateClick}
        >
          Next &gt;
        </button>
      </div>
      <div className="mx-auto mb-3">
        <h3 className="mb-0 text-light">{`Reservations for ${date}`}</h3>
      </div>
      <ReservationsList
        date ={date}
        reservations={reservations}
        buttons
      />
      <div className="mx-auto mb-3">
        <h3 className="mb-0 text-light">Tables</h3>
      </div>

      <TableList
        tables={tables}
        reservations={reservations}
      />
    </main>
  );
}

export default Dashboard;
