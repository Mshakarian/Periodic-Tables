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
function Dashboard({ date }) {
  const history = useHistory();
  const query = useQuery().get("date");
  if (query) date = query;

  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    try{
      const reservationsData = await listReservations({date}, abortController.signal)
      setReservations(reservationsData);
      const tablesData = await listTables(abortController.signal);
      setTables(tablesData);
    }  
    catch(error){
        setError(error);
      }
    return () => abortController.abort();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [date]);

  function nextDateClick(){
    history.push(`/dashboard?date=${next(date)}`);
  };

  function previousDateClick(){
    history.push(`/dashboard?date=${previous(date)}`);
  };

  function todayDateClick(){
    history.push(`/dashboard?date=${today()}`);
  };

  return (
    <main>
      <h1 className="text-light">Dashboard</h1>
      <ErrorAlert error={error} />
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
