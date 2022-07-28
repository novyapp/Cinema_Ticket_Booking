import React, { useState } from "react";
import Seats from "../components/Seats";

const createSeats = (rows, startIndex, endIndex) => {
  let i = 0;
  let j = startIndex;
  let k = "A";
  const section = [];
  while (i < 6 && j <= rows) {
    if (k > endIndex) {
      k = "A";
      j++;
    }
    if (j < rows + 1) {
      section.push(j + k);
      k = String.fromCharCode(k.charCodeAt(0) + 1);
    }
  }
  return section;
};

const movies = [
  {
    name: "Avenger",
    price: 10,
    occupied: ["4F", "4E", "4D", "4C", "2C", "2B"],
    cinema: {
      premiumRows: 2,
      premiumSeatsInRow: 3,
      normalRows: 8,
      normalSeatsInRow: 7,
    },
  },
];

export default function index() {
  function intToChar(int) {
    const code = "A".charCodeAt(0);
    return String.fromCharCode(code + int);
  }

  const premiumseatsInRow = movies[0]?.cinema.premiumSeatsInRow;
  const premiumRows = movies[0]?.cinema.premiumRows;
  const nsl = intToChar(premiumseatsInRow);
  const premiumSeats = createSeats(premiumRows, "1", nsl);

  const normalseatsInRow = movies[0]?.cinema.normalSeatsInRow;
  const normalRows = movies[0]?.cinema.normalRows;
  const psl = intToChar(normalseatsInRow);
  const normalSeats = createSeats(normalRows, "3", psl);

  const [availableSeats, setAvailableSeats] = useState(movies[0]?.occupied);
  const [bookedSeats, setBookedSeats] = useState([]);

  const addSeat = (ev) => {
    if (numberOfSeats && !ev.target.className.includes("disabled")) {
      const seatsToBook = parseInt(numberOfSeats, 10);
      if (bookedSeats.length <= seatsToBook) {
        if (bookedSeats.includes(ev.target.innerText)) {
          const newAvailable = bookedSeats.filter(
            (seat) => seat !== ev.target.innerText
          );
          setBookedSeats(newAvailable);
        } else if (bookedSeats.length < numberOfSeats) {
          setBookedSeats([...bookedSeats, ev.target.innerText]);
        } else if (bookedSeats.length === seatsToBook) {
          bookedSeats.shift();
          setBookedSeats([...bookedSeats, ev.target.innerText]);
        }
      }
    }
  };

  const confirmBooking = () => {
    const newAvailableSeats = [...availableSeats, ...bookedSeats];

    const movies = [
      {
        name: "Avenger",
        price: 10,
        occupied: newAvailableSeats,
        cinema: {
          premiumRows: 2,
          premiumSeatsInRow: 3,
          normalRows: 8,
          normalSeatsInRow: 7,
        },
      },
    ];
    console.log(movies);
    console.log(newAvailableSeats);
    setAvailableSeats(newAvailableSeats);

    console.log(availableSeats);

    setBookedSeats([]);
  };
  const [numberOfSeats, setNumberOfSeats] = useState(2);

  return (
    <div className="flex flex-col items-center w-full space-y-2">
      <h2>Booking ticket for{movies[0]?.name} </h2>

      <input
        className="bg-zinc-50 border-2 p-2"
        type="number"
        value={numberOfSeats}
        onChange={(ev) => setNumberOfSeats(ev.target.value)}
      />
      <Seats
        values={premiumSeats}
        seatsRow={premiumseatsInRow}
        availableSeats={availableSeats}
        bookedSeats={bookedSeats}
        addSeat={addSeat}
      />
      <Seats
        values={normalSeats}
        seatsRow={normalseatsInRow}
        availableSeats={availableSeats}
        bookedSeats={bookedSeats}
        addSeat={addSeat}
      />
      <button onClick={confirmBooking}>Book seats</button>
    </div>
  );
}
