import React, { useEffect, useState } from "react";
import { Mutation } from "react-query";
import Seats from "../components/Seats";
import { trpc } from "../utils/trpc";

const createSeats = (rows, startIndex, endIndex) => {
  let i = 0;
  let j = startIndex;
  let k = "A";
  let eI = endIndex + 1;
  const section = [];
  while (i < 6 && j <= rows) {
    if (k > eI) {
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

    occupied: ["4F", "4E", "4D", "4C", "2C", "2B"],
    cinema: {
      premiumRows: 2,
      premiumSeatsInRow: 6,
      normalRows: 6,
      normalSeatsInRow: 8,
    },
  },
];

export default function index() {
  const { data: movie, isLoading } = trpc.useQuery([
    "movie.get-movie",
    { id: "cl656hnzb0154jgvnhkmlhfcg" },
  ]);
  const { data: MovieSeance } = trpc.useQuery([
    "movie.get-movie-seanse",
    { id: "cl656kn4g0215jgvn5ubntljx" },
  ]);
  const updateseats = trpc.useMutation("movie.update-movie");

  //console.log(MovieSeance);

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

  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const time = movie?.MovieSeance[0]?.date.toLocaleTimeString();
  const [selectedTime, setSelectedTime] = useState();

  useEffect(() => {
    if (movie) {
      setAvailableSeats(movie.MovieSeance[0]?.takenSeats);
      setSelectedTime(movie.MovieSeance[0]);
    }
  }, [movie]);
  //console.log(movie?.MovieSeance[0]?.takenSeats);
  //console.log(availableSeats);

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
    setAvailableSeats(newAvailableSeats);
    setBookedSeats([]);
    updateseats.mutate({
      id: movie?.MovieSeance[0]?.id,
      seats: bookedSeats,
    });
  };
  const [numberOfSeats, setNumberOfSeats] = useState(2);

  function Movies({ seanseTime, onChange }) {
    //console.log("SeanseTime", seanseTime);
    return (
      <div className="Movies">
        <select
          id="movie"
          value={seanseTime?.id}
          onChange={(e) => {
            onChange(
              movie?.MovieSeance.find((movie) => movie.id === e.target.value)
            );
          }}
        >
          {movie?.MovieSeance.map((time) => (
            <option key={time.id} value={time.id}>
              {movie.title} at {time.date.toLocaleTimeString()}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (!movie && isLoading) return null;
  if (movie && !isLoading)
    return (
      <div className="flex flex-col items-center w-full space-y-2">
        {!isLoading && (
          <>
            <Movies
              seanseTime={selectedTime}
              onChange={(selectedTime) => {
                setBookedSeats([]);
                setSelectedTime(selectedTime);
              }}
            />

            <div>
              <h2>Booking ticket for at:</h2>
              <div className="bg-zinc-600 p-2 text-white"></div>
              <input
                className="bg-zinc-50 border-2 p-2"
                type="number"
                value={numberOfSeats}
                onChange={(ev) => setNumberOfSeats(ev.target.value)}
              />
              <Seats
                values={premiumSeats}
                seanseTime={selectedTime}
                seatsRow={premiumseatsInRow}
                availableSeats={availableSeats}
                bookedSeats={bookedSeats}
                addSeat={addSeat}
              />
              <Seats
                values={normalSeats}
                seanseTime={selectedTime}
                seatsRow={normalseatsInRow}
                availableSeats={availableSeats}
                bookedSeats={bookedSeats}
                addSeat={addSeat}
              />
              <button onClick={confirmBooking}>Book seats</button>
            </div>
          </>
        )}
      </div>
    );
}
