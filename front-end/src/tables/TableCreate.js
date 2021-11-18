import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function TableCreate() {
  const history = useHistory();

  const [table, setTable] = useState({
    table_name: "",
    capacity: null,
    status: "free",
    reservation_id: null,
  });

  const [error, setError] = useState(null);

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    if (table.table_name.length >= 2) {
      createTable(table)
        .then(() => {
          history.push("/");
        })
        .catch(setError);
    } else {
      setError({ message: "Table Name must be at least 2 characters long" });
    }
  }

  function changeHandler({ target: { name, value } }) {
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  }
  return (
    <main className="text-light">
      <h1 className="mb-3">Create a new Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="string"
              value={table.table_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={table.capacity}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2 mt-2 btn-sm"
            onClick={cancelHandler}
          >
            <span className="oi oi-x" />Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success mt-2 btn-sm"
          >
           <span className="oi oi-check" />Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default TableCreate;
