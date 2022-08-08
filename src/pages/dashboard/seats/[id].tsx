import { AddEditHallSeats } from "../../../components/hallSeats";
import { prisma } from "../../../server/db/client";

export default AddEditHallSeats;

type paraProp = {
  params: { id: string };
};

export async function getServerSideProps({ params }: paraProp) {
  const cinemaHall = await prisma.cinemaHall.findFirst({
    where: {
      id: params.id,
    },
  });
  return {
    props: { cinemaHall },
  };
}
