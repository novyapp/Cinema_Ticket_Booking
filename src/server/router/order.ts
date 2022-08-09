import { createRouter } from "./context";
import { z } from "zod";

export const orderRouter = createRouter()
  .query("user-orders", {
    async resolve({ ctx }) {
      return await ctx.prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          movieSeance: {
            select: {
              startDate: true,
            },
          },
          movie: {
            select: {
              title: true,
            },
          },
        },
      });
    },
  })
  .mutation("create-order", {
    input: z.object({
      userId: z.string().optional(),
      movieSeanceId: z.string(),
      movieId: z.string(),
      seats: z.string().array(),
      paid: z.number(),
    }),
    async resolve({ ctx, input }) {
      console.log(input);
      const result = await ctx.prisma.order.create({
        data: {
          userId: input.userId,
          movieId: input.movieId,
          movieSeanceId: input.movieSeanceId,
          seats: input.seats,
          paid: input.paid,
        },
      });
      return result;
    },
  });
