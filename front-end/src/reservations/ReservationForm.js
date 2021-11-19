export default function ReservationForm({reservation,changeHandler,cancelHandler,submitHandler}) {
    return (
      <form onSubmit={submitHandler} className="mb-4" id="createForm">
        <div className="mb-3 text-light">
          <div className="mx-auto col-6 form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              className="form-control"
              value={reservation.first_name}
              required={true}
              placeholder="First Name"
              onChange={changeHandler}
            />
          </div>
          <div className="mx-auto col-6 form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              className="form-control"
              value={reservation.last_name}
              required={true}
              placeholder="Last Name"
              onChange={changeHandler}
            />
          </div>
          <div className="mx-auto col-6 form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobile_number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="form-control"
              value={reservation.mobile_number}
              required={true}
              placeholder="Cell Number"
              onChange={changeHandler}
            />
          </div>
          <div className="mx-auto col-6 form-group">
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              type="date"
              id="reservationDate"
              name="reservation_date"
              className="form-control"
              value={reservation.reservation_date}
              required={true}
              placeholder="Reservation Date"
              onChange={changeHandler}
            />
          </div>
          <div className="mx-auto col-6 form-group">
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              type="time"
              id="reservationTime"
              name="reservation_time"
              className="form-control"
              value={reservation.reservation_time}
              required={true}
              placeholder="Reservation Time"
              onChange={changeHandler}
            />
          </div>
          <div className="mx-auto col-6 form-group">
            <label htmlFor="people">Party Size</label>
            <input
              type="number"
              min="1"
              id="people"
              name="people"
              className="form-control"
              value={reservation.people}
              required={true}
              placeholder="Party Size"
              onChange={changeHandler}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            <span className="oi oi-x" /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={submitHandler}
          >
            <span className="oi oi-check" /> Submit
          </button>
        </div>
      </form>
    );
  }