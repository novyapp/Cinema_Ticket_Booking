import { MovieSeance } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Seat from "../components/Seat";
import { trpc } from "../utils/trpc";

export default function index() {
  const { data: nowPlaying, isLoading: isLoadingNowPlaying } = trpc.useQuery([
    "movie.get-now-playing",
  ]);
  console.log(nowPlaying);

  return (
    <Layout>
      <div className="pt-24 px-36">
        <div className="flex space-x-2 space-y-2 flex-col">
          <h2 className="text-2xl font-semibold flex">Now Playing</h2>
          <div className="flex flex-col space-y-2">
            {nowPlaying?.map((nowPlayingMovie) => (
              <Link
                key={nowPlayingMovie.id}
                href={`/movie/${nowPlayingMovie.slug}`}
              >
                <div className="bg-zinc-800 rounded-md p-2 cursor-pointer flex">
                  {nowPlayingMovie.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
