import React from "react";
import dynamic from "next/dynamic";
import { trpc } from "../../../utils/trpc";

const MovieCalendar = dynamic(
  () => import("../../../components/MovieCalendar"),
  {
    ssr: false,
  }
);

export default function index() {
  const { data: halls, isLoading: isLoadingHalls } = trpc.useQuery([
    "cinema.get-halls-in-cinema",
    { id: "cl66dr7gt0031sovnv5ib7wsu" },
  ]);
  const { data: seanse, isLoading: isLoadingSeanse } = trpc.useQuery([
    "cinema.get-seanses",
  ]);
  const { data: movieSeanse, isLoading: isLoadingMovieSeanse } = trpc.useQuery([
    "cinema.get-movie-seanses",
    {
      id: "cl66eii3m0215sovnoi1hteov",
    },
  ]);

  console.log(movieSeanse);

  return (
    <div>
      <MovieCalendar halls={halls} seans={seanse} />
    </div>
  );
}
