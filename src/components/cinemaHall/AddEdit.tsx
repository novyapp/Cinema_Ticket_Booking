import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Select from "react-select";

type Inputs = {
  name: string;
  hall: string;
};
export { AddEditHall };

export default function AddEditHall(props: { tech: any }) {
  const router = useRouter();
  const hallEdit = props?.tech;
  const isAddMode = !hallEdit;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const { data: cinemas, isLoading: isLoadingCinemas } = trpc.useQuery([
    "cinema.get-cinemas",
  ]);

  const cinemasQuery = cinemas?.map(({ name: valueid, id: value }) => ({
    value,
    label: valueid,
  }));
  //console.log("Cinemas result:", cinemas);
  //console.log("Cinemas select result:", cinemasQuery);

  const addCinemaHall = trpc.useMutation("cinema.add-hall");

  useEffect(() => {
    if (hallEdit) {
      setValue("hall", hall.name);
    }
  }, [hallEdit]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    return isAddMode ? createHall(data) : updateHall(hallEdit.id, data);
  };

  async function createHall(data: Inputs) {
    console.log(data);
    addCinemaHall.mutate({
      name: data.name,
      cinemaId: data.hall.value,
    });
  }

  async function updateHall(id: string, data: Inputs) {}

  return (
    <>
      <div className="flex flex-row items-center mb-4 justify-between px-3">
        <h1 className="text-2xl">Halls in Cinema</h1>
        <Link href="/dashboard/hall" className="ml-auto">
          <button className="btn btn-sm btn-primary">Go Back</button>
        </Link>
      </div>
      <table className="table w-full">
        <tbody>
          <tr>
            <td>
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
                  </div>
                  <div>
                    <input type="submit" className="btn btn-primary" />
                  </div>
                </div>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
