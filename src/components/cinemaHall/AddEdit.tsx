import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Select from "react-select";

type Inputs = {
  name: string;
  id: string;
};
export { AddEditHall };

export default function AddEditHall(props: any) {
  const utils = trpc.useContext();
  const [isAddModeHalls, setIsAddModeHalls] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const { data: cinemas, isLoading: isLoadingCinemas } = trpc.useQuery([
    "cinema.get-cinema",
    { id: "cl66dr7gt0031sovnv5ib7wsu" },
  ]);
  const {
    data: cinemaHalls,
    isLoading: isLoadingHalls,
    isFetching,
  } = trpc.useQuery([
    "cinema.get-halls-in-cinema",
    {
      id: "cl66dr7gt0031sovnv5ib7wsu",
    },
  ]);

  const addCinemaHall = trpc.useMutation("cinema.add-hall", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls-in-cinema");
    },
  });
  const updateCinemaHall = trpc.useMutation("cinema.update-hall", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls-in-cinema");
    },
  });
  const deleteCinemaHall = trpc.useMutation("cinema.delete-hall", {
    onSuccess() {
      utils.invalidateQueries("cinema.get-halls-in-cinema");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    return isAddModeHalls ? createHall(data) : updateHall(data);
  };

  async function createHall(data: Inputs) {
    console.log(data);
    addCinemaHall.mutate({
      name: data.name,
      cinemaId: cinemas?.id!,
    });
    reset();
  }

  async function updateHall(data: Inputs) {
    updateCinemaHall.mutate({
      id: data.id,
      name: data.name,
    });
  }

  const deleteHall = async (id: string) => {
    deleteCinemaHall.mutate({ id });
  };
  const updateHallEdit = async (hall: { id: string; name: string }) => {
    setIsAddModeHalls(false);
    setValue("id", hall.id);
    setValue("name", hall.name);
  };

  console.log(isAddModeHalls);
  if (isLoadingCinemas) return null;

  return (
    <>
      <div className="flex flex-row items-center mb-4 justify-between px-3">
        <h1 className="text-2xl">Halls in {cinemas?.name}</h1>
        <Link href="/dashboard/hall" className="ml-auto">
          <button className="btn btn-sm btn-primary">Go Back</button>
        </Link>
      </div>
      <div>
        <div className="p-2 h-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex space-x-5 items-center">
              <div>
                <input
                  {...register("name")}
                  className="bg-zinc-800 p-2 w-full"
                  placeholder="Hall name"
                />
              </div>

              <div>
                <button className="bg-orange-500 p-2 rounded-md disabled:bg-black">
                  {isAddModeHalls ? "Add" : "Edit"}
                </button>
                {!isAddModeHalls && (
                  <button
                    className="p-2 border border-zinc-700 rounded-md ml-2"
                    onClick={() => {
                      setIsAddModeHalls(true);
                      reset();
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
              <div>
                {/* 
              
                <Controller
                  control={control}
                  name="hall"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      className="my-react-select-container"
                      classNamePrefix="my-react-select"
                      options={cinemasQuery}
                      value={cinemasQuery?.find((c) => c.value === value)}
                      onChange={(val) => onChange(val)}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: "#ea580c",
                          primary50: "#ea580c",
                          primary25: "#323232",
                          primary: "#323232",
                          neutral0: "#212121",
                          neutral5: "#323232",
                          neutral10: "#484848",
                          neutral20: "#484848",
                          neutral80: "white",
                        },
                      })}
                    />
                  )}
                />
               */}
              </div>
            </div>
          </form>
        </div>
        <div className="flex flex-col divide-y divide-zinc-700 mt-6">
          {cinemaHalls?.map((hall) => (
            <div
              key={hall.id}
              className="flex hover:bg-zinc-800 p-4 items-center "
            >
              <Link href={`/dashboard/seats/${hall.id}`}>
                <div className=" cursor-pointer" key={hall.id}>
                  {hall.name}
                </div>
              </Link>
              <div className="space-x-4 ml-auto ">
                <button
                  disabled={!isAddModeHalls}
                  onClick={() => updateHallEdit(hall)}
                  className="bg-orange-600 p-2 rounded-md disabled:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-600"
                >
                  Edit
                </button>
                <button
                  disabled={!isAddModeHalls}
                  onClick={() => deleteHall(hall.id)}
                  className="bg-red-600 p-2 rounded-md disabled:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
