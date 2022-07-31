import { MovieSeance } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Seat from "../components/Seat";
import Seats from "../components/Seats";
import { trpc } from "../utils/trpc";

interface CinemaType {
  movie: object | undefined;
  numberOfSeats: string | number;
  selectedSeats: string[];
  onSelectedSeatsChange: Function;
}
interface MoviesType {
  movie:
    | {
        id: string;
        name: string;
        takenSeats: string[] | undefined;
      }
    | null
    | undefined;
  onChange: (movie: {
    id: string;
    name: string;
    takenSeats: string[] | undefined;
    date: string;
    cinemaHallId: string;
    movieId: string;
  }) => void;
}

export default function App() {
  const { data: cinema, isLoading } = trpc.useQuery([
    "cinema.get-halls",
    { id: "cl66dr7gt0031sovnv5ib7wsu" },
  ]);
  const utils = trpc.useContext();
  const updateseats = trpc.useMutation("movie.update-movie", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls", {
        id: "cl66dr7gt0031sovnv5ib7wsu",
      });
    },
  });
  const deftime = cinema?.cinemaHall[0]?.movieSeance[0];
  const seats = cinema?.cinemaHall[0]?.seats;

  console.log(seats);

  const [selectedMovie, setSelectedMovie] = useState<MovieSeance | undefined>(
    deftime
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(2);

  useEffect(() => {
    setSelectedMovie(deftime);
  }, [isLoading]);

  const Movies = ({ movie, onChange }: MoviesType) => {
    return (
      <div className="flex justify-center items-center space-x-4">
        <label htmlFor="movie">Pick a time:</label>
        <select
          className="text-zinc-200 bg-zinc-700 p-2 rounded-md"
          id="movie"
          value={movie?.id}
          onChange={(e) => {
            onChange(
              cinema?.cinemaHall[0]?.movieSeance.find(
                (mov) => mov.id === e.target.value
              )
            );
          }}
        >
          {cinema?.cinemaHall[0]?.movieSeance.map((mov) => (
            <option
              key={mov.id}
              value={mov.id}
              className="text-zinc-200 bg-zinc-700"
            >
              {mov.date.toLocaleTimeString()}
            </option>
          ))}
        </select>
        <label>Number of tickets: </label>

        <input
          className="text-zinc-200 bg-zinc-700 p-2 rounded-md w-20"
          type="number"
          value={numberOfSeats}
          onChange={(ev) =>
            setNumberOfSeats(ev.target.value as unknown as number)
          }
        />
      </div>
    );
  };

  const confirmBooking = () => {
    const newAvailableSeats = [...selectedMovie.takenSeats, ...selectedSeats];
    console.log("new seats", newAvailableSeats);
    setSelectedMovie((mov) =>
      mov?.id ? { ...mov, takenSeats: newAvailableSeats } : mov
    );
    updateseats.mutate({
      id: selectedMovie?.id,
      seats: selectedSeats,
    });

    setSelectedSeats([]);
  };
  if (!cinema && isLoading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-t from-slate-800 via-slate-900 to-black/90 items-center space-y-6 ">
      <Movies
        movie={selectedMovie}
        onChange={(movie) => {
          setSelectedSeats([]);
          setSelectedMovie(movie);
        }}
      />

      <ShowCase />
      <Cinema
        seatsIn={seats}
        movie={selectedMovie}
        numberOfSeats={numberOfSeats}
        selectedSeats={selectedSeats}
        onSelectedSeatsChange={(selectedSeats: React.SetStateAction<never[]>) =>
          setSelectedSeats(selectedSeats)
        }
      />
      <button
        onClick={confirmBooking}
        className="rounded-md p-2 bg-gradient-to-b from-pink-500 to bg-pink-600 font-semibold text-white w-32"
      >
        Book seats
      </button>
    </div>
  );
}

function ShowCase() {
  return (
    <ul className="flex items-center justify-center space-x-4 py-6">
      <li className="flex flex-col items-center">
        <span className="flex rounded-md  h-10 bg-zinc-400 w-10 text-zinc-500" />
        <small>N/A</small>
      </li>
      <li className="flex flex-col items-center">
        <span className="flex rounded-md w-10 h-10 text-zinc-500 bg-gradient-to-t from-pink-700 to-pink-500" />
        <small>Selected</small>
      </li>
      <li className="flex flex-col items-center">
        <span className="flex rounded-md w-10 h-10 bg-zinc-800 pointer-events-none text-zinc-700" />
        <small>Occupied</small>
      </li>
    </ul>
  );
}

function Cinema({
  movie,
  seatsIn,
  numberOfSeats,
  selectedSeats,
  onSelectedSeatsChange,
}: CinemaType) {
  function handleSelectedState(seat: string) {
    const seatsToBook = parseInt(numberOfSeats as string, 10);
    const isSelected = selectedSeats.includes(seat);

    const test = numberOfSeats;
    console.log(test);

    if (seatsToBook >= selectedSeats.length) {
      if (isSelected) {
        onSelectedSeatsChange(
          selectedSeats.filter((selectedSeat: string) => selectedSeat !== seat)
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
  if (!movie) return null;
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <Seat
          seatsIn={seatsIn}
          movie={movie}
          handleSelectedState={handleSelectedState}
          selectedSeats={selectedSeats}
        />
      </div>
    </>
  );
}
