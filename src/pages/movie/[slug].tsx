import { MovieSeance } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Seat from "../../components/Seat";
import { trpc } from "../../utils/trpc";
import moment from "moment";
import _, { map } from "underscore";

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
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(
    "https://api.themoviedb.org/3/movie/361743?api_key=6c1990d663f2b81dc2690366937da078&language=en-US"
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default function App({ data }) {
  const { data: movieSes, isLoading: isLoading } = trpc.useQuery([
    "cinema.get-movie-seanses",
    { id: "cl66eii3m0215sovnoi1hteov" },
  ]);

  const defta = movieSes?.movieSeance;
  const movieSeansByDay = _.groupBy(defta, function (se) {
    return moment(se["startDate"]).startOf("day").format();
  });

  const movieSeansByDayResult = _.map(movieSeansByDay, function (group, day) {
    return {
      day: day,
      times: group,
    };
  });

  //console.log(movieSeansByDayResult);

  const utils = trpc.useContext();
  const updateseats = trpc.useMutation("movie.update-movie", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-movie-seanses", {
        id: "cl66eii3m0215sovnoi1hteov",
      });
    },
  });
  const deftime = movieSes?.movieSeance[0];

  const [selectedMovie, setSelectedMovie] = useState<MovieSeance | undefined>(
    deftime
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(2);

  useEffect(() => {
    setSelectedMovie(deftime);
  }, [isLoading]);

  const Movies = ({ movie, onChange }: MoviesType) => {
    console.log(movie);
    const [activeTimeId, setActiveTimeId] = useState(movie?.id);

    return (
      <>
        <div>
          {movieSeansByDayResult.map((days) => (
            <div className="flex">
              <div className="p-2 px-4 m-2 border-pink-500 border flex rounded-md justify-center items-center">
                {moment(days.day).format("D MMMM")}
              </div>
              <div className="flex">
                {days.times.map((time) => (
                  <div
                    onClick={() => {
                      setSelectedMovie(time);
                      setActiveTimeId(time.id);
                      setSelectedSeats([]);
                    }}
                    className={`bg-zinc-800 p-6 m-2 flex flex-col items-center rounded-md p-2${
                      activeTimeId === time.id
                        ? "flex bg-gradient-to-t from-pink-700 to-pink-500"
                        : null
                    }`}
                  >
                    <span className="text-xs">{time.cinemaHall.name}</span>
                    <span className="font-semibold">
                      {moment(time.startDate).format("H:mm")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-6">
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
          <div className="p-4 rounded-md bg-zinc-800 flex flex-col my-4 space-y-2">
            <h3 className="font-semibold text-2xl">
              {selectedMovie?.Movie.title}
            </h3>
            <div className="flex space-x-4 text-sm pb-4">
              <span>
                Day: {moment(selectedMovie?.startDate).format(" DD/MM")}
              </span>
              <span>
                Time:{moment(selectedMovie?.startDate).format(" H:mm")}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <h4 className="bg-zinc-700 rounded-md p-2">Selected seats</h4>
              <div className="flex items-end space-x-2">
                {selectedSeats.map((seat) => (
                  <div className="border-zinc-700 border  rounded-md p-2 flex w-10 h-10 justify-center items-center">
                    {seat}
                  </div>
                ))}
                {!selectedSeats.length && (
                  <div className="border-zinc-700 border rounded-md text-sm text-zinc-600 p-2 flex h-10 w-full justify-center items-center">
                    You didn't select any seats
                  </div>
                )}
              </div>
              <div className="flex items-center pt-4">
                <button
                  onClick={confirmBooking}
                  className="rounded-md p-2 bg-gradient-to-l from-pink-500 to bg-pink-600 font-semibold text-white w-32 "
                >
                  Book tickets
                </button>
                <div className="ml-auto pr-2 text-xl">
                  To pay: ${selectedMovie?.Movie.price * selectedSeats.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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
  if (!movieSes && isLoading) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b lg:min-h-[120vh] ">
      <main className="relative px-4 pb-24 lg:space-y-24 lg:px-36 ">
        <div className="flex flex-col space-y-4 py-24 md:space-y-4 lg:h-[90vh] lg:pb-24 ">
          <div className="absolute top-0 left-0 -z-10 h-[55vh]  md:h-[85vh] w-screen ">
            <Image
              src={`https://image.tmdb.org/t/p/original/${
                data?.backdrop_path || data?.poster_path
              }`}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="flex flex-col space-y-6 md:min-h-[70vh] md:w-[70vh]">
            <h1 className="ml-[-6px] pb-2 text-transparent uppercase font-bold text-7xl bg-clip-text bg-gradient-to-l from-pink-600 to-pink-400">
              {data.original_title}
            </h1>
            <p>{data.overview}</p>
          </div>
          <div className="flex py-16 justify-evenly w-full min-h-screen">
            <div className="flex flex-col space-y-6">
              <Movies
                movie={selectedMovie}
                onChange={(movie) => {
                  setSelectedSeats([]);
                  setSelectedMovie(movie);
                }}
              />
            </div>
            <div className="flex flex-col space-y-6 justify-start w-[50vh]">
              <div className="mt-3 mb-8 bg-pink-500 shadow-xl shadow-pink-500/50 rounded-md justify-center flex p-2 text-xs text-pink-200 font-semibold">
                SCREEN
              </div>
              <Cinema
                movie={selectedMovie}
                numberOfSeats={numberOfSeats}
                selectedSeats={selectedSeats}
                onSelectedSeatsChange={(
                  selectedSeats: React.SetStateAction<never[]>
                ) => setSelectedSeats(selectedSeats)}
              />
              <ShowCase />
            </div>
          </div>
        </div>
      </main>
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
  numberOfSeats,
  selectedSeats,
  onSelectedSeatsChange,
}: CinemaType) {
  function handleSelectedState(seat: string) {
    const seatsToBook = parseInt(numberOfSeats as string, 10);
    const isSelected = selectedSeats.includes(seat);

    const test = numberOfSeats;

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
          movie={movie}
          handleSelectedState={handleSelectedState}
          selectedSeats={selectedSeats}
        />
      </div>
    </>
  );
}
