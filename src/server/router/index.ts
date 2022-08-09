// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { movieRouter } from "./movie";
import { orderRouter } from "./order";
import { cinemaRouter } from "./cinema";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("movie.", movieRouter)
  .merge("order.", orderRouter)
  .merge("cinema.", cinemaRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
