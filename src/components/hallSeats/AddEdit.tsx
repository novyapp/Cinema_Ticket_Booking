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
    reset,
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

  const deleteSeats = async (id: string) => {
    console.log("id", id);
    deleteSeatsInHall.mutate({ id });
  };
  const updateSeatRow = async (seat: {
    id: string;
    name: string;
    numberOfRows: string;
    numberOfSeats: string;
  }) => {
    setIsAddMode(false);
    setValue("id", seat.id);
    setValue("name", seat.name);
    setValue("rows", seat.numberOfRows);
    setValue("seats", seat.numberOfSeats);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    return isAddMode ? createSeats(data) : updateSeats(data);
  };

  async function createSeats(data: Inputs) {
    console.log(data);
    addHallSeats.mutate({
      name: data.name,
      cinemaHallId: hallSeats?.id!,
      numberOfRows: parseInt(data.rows),
      numberOfSeats: parseInt(data.seats),
    });
  }

  async function updateSeats(data: Inputs) {
    updateHallSeats.mutate({
      id: data.id,
      name: data.name,
      numberOfRows: parseInt(data.rows),
      numberOfSeats: parseInt(data.seats),
    });
    setIsAddMode(true);
    reset();
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
      <div className="w-full flex flex-col space-y-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-5 items-center">
            <label>Name:</label>
            <input {...register("name")} className="bg-zinc-800 p-2 " />
            <label>Rows:</label>
            <input
              {...register("rows")}
              className="bg-zinc-800 p-2 pl-4 w-16"
              type="number"
              min="0"
            />
            <label>Seats:</label>
            <input
              type="number"
              {...register("seats")}
              className="bg-zinc-800 p-2 pl-4 w-16"
              min="0"
            />

            <div>
              <button className="bg-orange-500 p-2 rounded-md">
                {isAddMode ? "Submit" : "Edit"}
              </button>
              {!isAddMode && (
                <button
                  className="p-2 border border-zinc-700 rounded-md ml-2"
                  onClick={() => {
                    setIsAddMode(true);
                    reset();
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <SeatAdmin
          seatsIn={hallSeats?.seats}
          deleteSeats={deleteSeats}
          updateSeatRow={updateSeatRow}
        />
      </div>
    </>
  );
}
