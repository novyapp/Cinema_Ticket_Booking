import React from "react";

const Seats = (props) => {
  console.log(props);
  const row = props.seatsRow;
  return (
    <div className={`grid grid-cols-${row} gap-2`}>
      {props.values.map((seat) => {
        const isAvailable = props.availableSeats.includes(seat);
        const isBooked = props.bookedSeats.includes(seat);
        return (
          <div
            key={seat}
            onClick={props.addSeat}
            className={`bg-black/40 p-2 rounded-md ${
              isAvailable && "bg-red-500 pointer-events-none"
            } ${isBooked && "bg-green-500"}`}
          >
            {seat}
          </div>
        );
      })}
    </div>
  );
};
export default Seats;
