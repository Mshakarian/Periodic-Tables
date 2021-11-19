import React from "react";
import { finishTable } from "../utils/api";
import { useHistory } from "react-router-dom";

function TableList({tables, reservations}){
  const history = useHistory();
  if(tables === undefined){
    return (
    <div>Tables Loading...</div>
    )
  }
  
  function finishTableHandler({target}){
    const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if(result){
      const tableId = target.id;
      const abortController = new AbortController();
      finishTable(tableId,abortController.signal).then(()=> history.push("/"));
    }
  }

  const tableCards = tables
    .sort((a, b) =>
      a.table_name > b.table_name ? 1 : b.table_name > a.table_name ? -1 : 0
    )
    .map((table) => {
      let tableRes = reservations.find(reservation => reservation.reservation_id === table.reservation_id);
      let partyName = tableRes ? tableRes.last_name : null;      
      return (
        <div className="col-lg-4 col-xl-3 m-3 card text-dark" key={table.table_id} >
          <h5 className="table-card-title">Table: {table.table_name}</h5>
          <div>
            <h5 data-table-id-status={table.table_id}>Status:{" "}
             {table.status}
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
              id={table.table_id}
              onClick={finishTableHandler}
            >
              Finish
            </button>
            </div>
          ) : null}
          </div>
      )
    });
    return <div className="mx-auto row justify-content-around">{tableCards}</div>
  };
  export default TableList;