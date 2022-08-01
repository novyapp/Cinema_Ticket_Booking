import { createRouter } from "./context";
import { z } from "zod";

export const cinemaRouter = createRouter()
  .query("get-cinemas", {
    async resolve({ ctx }) {
      return await ctx.prisma.cinema.findMany({
        orderBy: {
          name: "asc",
        },
      });
    },
  })
  .query("get-halls-seats", {
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
              name: "asc",
            },
          },
        },
      });
    },
  })
  .mutation("add-seats-to-hall", {
    input: z.object({
      cinemaHallId: z.string(),
      name: z.string(),
      numberOfRows: z.number(),
      numberOfSeats: z.number(),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.seats.create({
        data: {
          name: input.name,
          cinemaHallId: input.cinemaHallId,
          numberOfRows: input.numberOfRows,
          numberOfSeats: input.numberOfSeats,
        },
      });
      return result;
    },
  })
  .mutation("update-seats-in-hall", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      numberOfRows: z.number(),
      numberOfSeats: z.number(),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.seats.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          numberOfRows: input.numberOfRows,
          numberOfSeats: input.numberOfSeats,
        },
      });
      return result;
    },
  })
  .mutation("delete-seats", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.seats.delete({
        where: {
          id: input.id,
        },
      });
      return result;
    },
  })
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
                  name: "asc",
                },
              },
            },
          },
        },
      });
    },
  })
  .mutation("add-hall", {
    input: z.object({
      name: z.string(),
      cinemaId: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log(input);
      const result = await ctx.prisma.cinemaHall.create({
        data: {
          name: input.name,
          cinemaId: input.cinemaId,
        },
      });
      return result;
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
