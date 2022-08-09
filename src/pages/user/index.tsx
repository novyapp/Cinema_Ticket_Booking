import React from "react";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import moment from "moment";

export default function User() {
  const { data: orders, isLoading: isLoading } = trpc.useQuery([
    "order.user-orders",
  ]);
  console.log(orders);

  if (isLoading) return null;

  return (
    <Layout>
      <div className="m-36 my-24  p-4">
        <h1 className="text-zinc-300 text-4xl">Welcome User</h1>
        <div className="flex space-x-10 my-6">
          <div className="flex border border-zinc-700 min-h-screen w-full rounded-md"></div>
          <div className="flex min-h-screen w-full flex-col ">
            <h2
              className="text-sm  text-zinc-400
            "
            >
              Your ticket history
            </h2>
            <div className="flex flex-col ">
              {orders?.length === 0 && (
                <div className="flex flex-col w-full text-zinc-600 border border-zinc-700 rounded-md p-4 my-4">
                  You didnt buy any ticket yet
                </div>
              )}
              {orders &&
                orders?.map((order) => (
                  <div
                    className="flex flex-col w-full text-zinc-600 divide-zinc-700 divide-y 
                border border-zinc-700 rounded-md p-4 my-4 first:text-zinc-300 first:bg-zinc-800 first:border-zinc-600
                 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300 transition duration-300"
                  >
                    <div className="flex space-x-6 items-start p-2 pb-4">
                      <div className="flex flex-col text-xs ">
                        <span>
                          {moment(order.movieSeance.startDate).format("D MMMM")}
                        </span>
                        <span>
                          {moment(order.movieSeance.startDate).format("H:mm")}
                        </span>
                      </div>
                      <div className="text-xl mt-[-4px] font-semibold ">
                        {order.movie.title}
                      </div>
                    </div>
                    <div className="flex pt-4 space-x-2">
                      {order.seats.map((seat) => (
                        <div className="flex border border-zinc-700 rounded-md items-center justify-center p-2 w-12 h-12">
                          {seat}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
