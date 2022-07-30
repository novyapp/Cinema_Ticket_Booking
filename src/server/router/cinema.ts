import { createRouter } from "./context";
import { z } from "zod";

export const cinemaRouter = createRouter()
  .query("get-halls", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.cinema.findUnique({
        where: {
          id: input.id,
        },
        include: {
          cinemaHall: {
            include: {
              movieSeance: true,
              seats: {
                orderBy: {
                  name: "desc",
                },
              },
            },
          },
        },
      });
    },
  })
  .query("get-cinema-seanse", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.movieSeance.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("get-hall-sections", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.cinemaHall.findUnique({
        where: {
          id: input.id,
        },
        include: {
          seats: {
            orderBy: {
              name: "desc",
            },
          },
        },
      });
    },
  });
