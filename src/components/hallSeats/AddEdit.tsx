import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Select from "react-select";
import Seat from "../Seat";
import SeatAdmin from "../SeatAdmin";

type Inputs = {
  id: string;
  name: string;
  hall: string;
  rows: string;
  seats: string;
};
export { AddEditHallSeats };

export default function AddEditHallSeats() {
  const utils = trpc.useContext();

  const [isAddMode, setIsAddMode] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const { data: hallSeats, isLoading: isLoadingHallSeats } = trpc.useQuery([
    "cinema.get-halls-seats",
    {
      id: "cl66egllv0141sovn1kf94p19",
    },
  ]);
  const addHallSeats = trpc.useMutation("cinema.add-seats-to-hall", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls-seats");
    },
  });
  const updateHallSeats = trpc.useMutation("cinema.update-seats-in-hall", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls-seats");
    },
  });
  //console.log(hallSeats);

  const deleteSeatsInHall = trpc.useMutation("cinema.delete-seats", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls-seats");
    },
  });

  const deleteSeats = async (id) => {
    console.log(id);
    deleteSeatsInHall.mutate({ id });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    return isAddMode ? createSeats(data) : updateSeats(data);
  };

  async function createSeats(data: Inputs) {
    console.log(data);
    addHallSeats.mutate({
      name: data.name,
      cinemaHallId: hallSeats.id,
      numberOfRows: parseInt(data.rows),
      numberOfSeats: parseInt(data.seats),
    });
  }

  async function updateSeats(data: Inputs) {
    console.log("data edit", data);

    updateHallSeats.mutate({
      id: data.id,
      name: data.name,
      numberOfRows: parseInt(data.rows),
      numberOfSeats: parseInt(data.seats),
    });
    setIsAddMode(true);
  }

  console.log(isAddMode);

  if (isLoadingHallSeats) return null;
  return (
    <>
      <div className="flex flex-row items-center mb-4 justify-between px-3">
        <h1 className="text-2xl">Seats in hall: {hallSeats?.name}</h1>
        <Link href="/dashboard/seats" className="ml-auto">
          <button className="btn btn-sm btn-primary">Go Back</button>
        </Link>
      </div>
      <div className=" w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-5 items-center">
            <div>
              <input
                {...register("name")}
                className="bg-zinc-800 p-2 w-full"
                placeholder="name"
              />
              <input
                {...register("rows")}
                className="bg-zinc-800 p-2 w-full"
                placeholder="row"
                type="number"
                min="0"
              />
              <input
                type="number"
                {...register("seats")}
                className="bg-zinc-800 p-2 w-full"
                placeholder="seats"
                min="0"
              />
            </div>
            <div>
              <input type="submit" className="btn btn-primary" />
            </div>
          </div>
        </form>
        {hallSeats.seats.map((seat) => (
          <div className="flex space-x-6">
            <span>Id: {seat.id}</span>
            <span>Name: {seat.name}</span>
            <span>Rows: {seat.numberOfRows}</span>
            <span>Number seats in row: {seat.numberOfSeats}</span>
            <button
              onClick={() => {
                setIsAddMode(false);
                setValue("id", seat.id);
                setValue("name", seat.name);
                setValue("rows", seat.numberOfRows);
                setValue("seats", seat.numberOfSeats);
              }}
              className="btn btn-error btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteSeats(seat.id);
              }}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
          </div>
        ))}

        <SeatAdmin seatsIn={hallSeats?.seats} />
      </div>
    </>
  );
}
