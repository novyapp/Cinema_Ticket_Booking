import { MovieSeance } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Seat from "../../components/Seat";
import { trpc } from "../../utils/trpc";
import moment from "moment";
import _, { map } from "underscore";
import Layout from "../../components/Layout";
import ReactPlayer from "react-player";
import { prisma } from "../../server/db/client";
import type Prisma from "@prisma/client";

type MovieProps = Readonly<Prisma.Movie> | undefined;
type SeanseProps = Readonly<Prisma.MovieSeance> | undefined;
type HallProps = Readonly<Prisma.CinemaHall> | undefined;

type dataTmdb = {
  overview: string;
  spoken_languages: any;
  english_name: string;
  genres: {
    map(
      arg0: (genre: { id: string; name: string }) => JSX.Element
    ): React.ReactNode;
  };
  original_title: string;
  poster_path: string;
  backdrop_path: string;
  videos: any;
  type: string;
};

export async function getServerSideProps({
  params,
}: {
  params: { slug: string };
}) {
  const moviedata = await prisma.movie.findFirst({
    where: {
      slug: params.slug,
    },
  });
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${moviedata?.tmdbId}?api_key=${process.env.TMDB_API}&language=en-US&append_to_response=videos`
  );
  const data = await res.json();
  return { props: { data, moviedata } };
}

export default function App({
  data,
  moviedata,
}: {
  data: dataTmdb;
  moviedata: any;
}) {
  const { data: movieSes, isLoading: isLoading } = trpc.useQuery([
    "cinema.get-movie-seanses",
    { id: moviedata.id },
  ]);

  const defta = movieSes?.movieSeance;
  const movieSeansByDay = _.groupBy(defta as any, function (se) {
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
      utils.invalidateQueries("cinema.get-movie-seanses");
    },
  });
  const deftime = movieSes?.movieSeance[0];
  console.log(deftime);

  const [selectedMovie, setSelectedMovie] = useState(deftime);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState("2");
  const [trailer, setTrailer] = useState();

  useEffect(() => {
    if (data?.videos) {
      const index = data.videos.results.findIndex(
        (element: { type: string }) => element.type === "Trailer"
      );
      setTrailer(data.videos?.results[index]?.key);
    }
    setSelectedMovie(deftime);
  }, [isLoading]);

  const Movies = ({ movie, onChange }: { movie: any; onChange: Function }) => {
    const [activeTimeId, setActiveTimeId] = useState(movie?.id);

    return (
      <>
        <div>
          {movieSeansByDayResult.map((days) => (
            <div key={days.day} className="flex flex-col xl:flex-row">
              <div className="p-2 px-4 m-2 border-pink-500 flex border rounded-md justify-center items-center">
                {moment(days.day).format("D MMMM")}
              </div>
              <div className="flex flex-wrap">
                {days.times.map((time) => (
                  <div
                    key={time.id}
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
              onChange={(ev) => setNumberOfSeats(ev.target.value)}
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
                  <div
                    key={seat}
                    className="border-zinc-700 border  rounded-md p-2 flex w-10 h-10 justify-center items-center"
                  >
                    {seat}
                  </div>
                ))}
                {!selectedSeats.length && (
                  <div className="border-zinc-700 border rounded-md text-sm text-zinc-600 p-2 flex h-10 w-full justify-center items-center">
                    You didnt select any seats
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
                  To pay: ${selectedMovie?.Movie.price! * selectedSeats.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const confirmBooking = () => {
    const newAvailableSeats = [
      ...(selectedMovie?.takenSeats ?? []),
      ...selectedSeats,
    ];
    console.log("new seats", newAvailableSeats);
    setSelectedMovie((mov) =>
      mov?.id ? { ...mov, takenSeats: newAvailableSeats } : mov
    );
    updateseats.mutate({
      id: selectedMovie?.id!,
      seats: selectedSeats,
    });

    setSelectedSeats([]);
  };
  if (!movieSes && isLoading) return null;

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-b lg:min-h-[110vh] ">
        <main className="relative px-4 pb-24 lg:space-y-24 lg:px-36">
          <div className="flex flex-col space-y-4 py-24 h-[70vh] md:space-y-4 lg:h-[90vh] lg:pb-24 ">
            <div className="absolute top-0 left-0 -z-10 h-[95vh] md:h-[85vh] w-screen ">
              <Image
                src={`https://image.tmdb.org/t/p/original/${
                  data?.backdrop_path || data?.poster_path
                }`}
                alt="Background image"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-40">
              <div className="flex flex-col pb-60 space-y-2 md:pb-0 md:min-h-[70vh] justify-center md:w-[50vh]">
                <h1 className="ml-[-6px] pb-2 text-transparent uppercase font-bold text-6xl md:text-7xl bg-clip-text bg-gradient-to-l from-pink-600 to-pink-400">
                  {data.original_title}
                </h1>
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  {data.genres && (
                    <div className="flex space-x-2">
                      <span className="font-semibold">Genre:</span>
                      {data.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="flex rounded-md bg-zinc-800 p-1 text-xs px-4"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <span className="font-semibold">Language:</span>
                    <span className="flex rounded-md bg-zinc-800 p-1 text-xs px-4">
                      {data.spoken_languages[0]?.english_name}
                    </span>
                  </div>
                </div>
                <p className="pt-4">{data.overview}</p>
              </div>
              {trailer && (
                <div className="flex justify-end items-center md:w-[50%]">
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${trailer}`}
                    playing
                    controls={true}
                    light={`https://image.tmdb.org/t/p/original/${
                      data?.poster_path || data?.backdrop_path
                    }`}
                    style={{
                      background: "#27272A",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col py-16 md:flex-row md:justify-center w-full  md:space-x-20">
              {!movieSes?.movieSeance.length && (
                <div className="bg-zinc-800 p-4 py-8 flex justify-center text-zinc-400 w-full rounded-md">
                  The movie is not currently displayed
                </div>
              )}
              {movieSes?.movieSeance.length! > 0 && (
                <>
                  <div className="flex flex-col space-y-6 md:w-[50%]">
                    <Movies
                      movie={selectedMovie}
                      onChange={(
                        movie: React.SetStateAction<
                          | (MovieSeance & {
                              Movie: Prisma.Movie;
                              cinemaHall: Prisma.CinemaHall & {
                                seats: Prisma.Seats[];
                              };
                            })
                          | undefined
                        >
                      ) => {
                        setSelectedSeats([]);
                        setSelectedMovie(movie);
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-6  min-h-screen md:w-[50%]">
                    <div className="mb-8 mt-3 bg-pink-500 shadow-xl shadow-pink-500/50 rounded-md justify-center flex p-2 text-xs text-pink-200 font-semibold ">
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
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
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
}: {
  movie: object | undefined;
  numberOfSeats: string;
  selectedSeats: string[];
  onSelectedSeatsChange: Function;
}) {
  console.log(typeof numberOfSeats);
  function handleSelectedState(seat: string) {
    const seatsToBook = parseInt(numberOfSeats, 10);
    const isSelected = selectedSeats.includes(seat);

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
