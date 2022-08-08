import { createRouter } from "./context";
import { z } from "zod";

export const movieRouter = createRouter()
  .query("get-now-playing", {
    async resolve({ ctx, input }) {
      return await ctx.prisma.movie.findMany();
    },
  })
  .query("get-movie", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.movie.findUnique({
        where: {
          id: input.id,
        },
        include: {
          movieSeance: true,
        },
      });
    },
  })
  .query("get-movie-seanse", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.movieSeance.findUnique({
        where: {
          id: input.id,
        },
        include: {
          movie: true,
        },
      });
    },
  })
  .mutation("update-movie", {
    input: z.object({
      id: z.string().optional(),
      seats: z.any(),
    }),
    async resolve({ input }) {
      console.log(input);
      const result = await prisma?.movieSeance.update({
        where: {
          id: input.id,
        },
        data: {
          takenSeats: {
            push: input.seats,
          },
        },
      });
      return result;
    },
  });
