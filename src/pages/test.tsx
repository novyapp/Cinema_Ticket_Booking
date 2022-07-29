import React, { useState } from "react";
import { trpc } from "../utils/trpc";

const movies = [
  {
    name: "Avenger",
    price: 10,
    occupied: ["1A", "2A"],
  },
  {
    name: "Joker",
    price: 12,
    occupied: [9, 41, 35, 11, 65, 26],
  },
  {
    name: "Toy story",
    price: 8,
    occupied: [37, 25, 44, 13, 2, 3],
  },
  {
    name: "the lion king",
    price: 9,
    occupied: [10, 12, 50, 33, 28, 47],
  },
];

//const seats = Array.from({ length: 8 * 8 }, (_, i) => i);

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

const premiumSeats = createSeats(3, "1", "D");
const normalSeats = createSeats(8, "4", "H");

export default function App() {
  const { data: movie, isLoading } = trpc.useQuery([
    "movie.get-movie",
    { id: "cl656hnzb0154jgvnhkmlhfcg" },
  ]);
  console.log(movie);
  const { data: MovieSeance } = trpc.useQuery([
    "movie.get-movie-seanse",
    { id: "cl656kn4g0215jgvn5ubntljx" },
  ]);
  const updateseats = trpc.useMutation("movie.update-movie");

  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(2);

  const confirmBooking = () => {
    const newAvailableSeats = [...selectedMovie?.occupied, ...selectedSeats];
    setSelectedMovie((mov) =>
      mov?.name ? { ...mov, occupied: newAvailableSeats } : mov
    );
    console.log(selectedMovie);
    setSelectedSeats([]);
  };

  return (
    <div className="App">
      <Movies
        movie={selectedMovie}
        onChange={(movie) => {
          setSelectedSeats([]);
          setSelectedMovie(movie);
        }}
      />
      <input
        className="bg-zinc-50 border-2 p-2"
        type="number"
        value={numberOfSeats}
        onChange={(ev) => setNumberOfSeats(ev.target.value)}
      />

      <ShowCase />
      <Cinema
        movie={selectedMovie}
        numberOfSeats={numberOfSeats}
        selectedSeats={selectedSeats}
        onSelectedSeatsChange={(selectedSeats) =>
          setSelectedSeats(selectedSeats)
        }
      />
      <p className="info">
        You have selected <span className="count">{selectedSeats.length}</span>{" "}
        seats for the price of{" "}
        <span className="total">
          {selectedSeats.length * selectedMovie.price}$
        </span>
      </p>
      <button onClick={confirmBooking}>Book seats</button>
    </div>
  );
}

function Movies({ movie, onChange }) {
  return (
    <div className="Movies">
      <label htmlFor="movie">Pick a movie</label>
      <select
        id="movie"
        value={movie.name}
        onChange={(e) => {
          onChange(movies.find((movie) => movie.name === e.target.value));
        }}
      >
        {movies.map((movie) => (
          <option key={movie.name} value={movie.name}>
            {movie.name} (${movie.price})
          </option>
        ))}
      </select>
    </div>
  );
}

function ShowCase() {
  return (
    <ul className="ShowCase">
      <li>
        <span className="seat" /> <small>N/A</small>
      </li>
      <li>
        <span className="seat selected" /> <small>Selected</small>
      </li>
      <li>
        <span className="seat occupied" /> <small>Occupied</small>
      </li>
    </ul>
  );
}

function Cinema({
  movie,
  numberOfSeats,
  selectedSeats,
  onSelectedSeatsChange,
}) {
  function handleSelectedState(seat) {
    const seatsToBook = parseInt(numberOfSeats, 10);
    const isSelected = selectedSeats.includes(seat);

    const test = numberOfSeats;
    console.log(test);

    if (seatsToBook >= selectedSeats.length) {
      if (isSelected) {
        onSelectedSeatsChange(
          selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
        );
      } else if (selectedSeats.length === seatsToBook) {
        selectedSeats.shift();
        onSelectedSeatsChange([...selectedSeats, seat]);
      } else {
        onSelectedSeatsChange([...selectedSeats, seat]);
      }
    } else if (seatsToBook < selectedSeats.length) {
      const slice = selectedSeats.slice(0, seatsToBook);
      slice.shift();
      onSelectedSeatsChange([...slice, seat]);
    }
  }

  return (
    <>
      <div></div>
      <div className="flex flex-col items-center space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {premiumSeats.map((seat) => {
            const isSelected = selectedSeats.includes(seat);
            const isOccupied = movie.occupied.includes(seat);
            return (
              <span
                key={seat}
                className={`bg-black/40 w-10 h-10 flex items-center justify-center  rounded-md ${
                  isSelected && "bg-green-500"
                } ${isOccupied && "bg-red-500 pointer-events-none"}`}
                onClick={isOccupied ? null : () => handleSelectedState(seat)}
                onKeyPress={
                  isOccupied
                    ? null
                    : (e) => {
                        if (e.key === "Enter") {
                          handleSelectedState(seat);
                        }
                      }
                }
              >
                {seat}
              </span>
            );
          })}
        </div>
        <div className="grid grid-cols-8 gap-2">
          {normalSeats.map((seat) => {
            const isSelected = selectedSeats.includes(seat);
            const isOccupied = movie.occupied.includes(seat);
            return (
              <span
                key={seat}
                className={`bg-black/40 w-10 h-10 flex items-center justify-center  rounded-md ${
                  isSelected && "bg-green-500"
                } ${isOccupied && "bg-red-500 pointer-events-none"}`}
                onClick={isOccupied ? null : () => handleSelectedState(seat)}
                onKeyPress={
                  isOccupied
                    ? null
                    : (e) => {
                        if (e.key === "Enter") {
                          handleSelectedState(seat);
                        }
                      }
                }
              >
                {seat}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
