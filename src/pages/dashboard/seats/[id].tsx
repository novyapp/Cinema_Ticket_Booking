import { AddEditHallSeats } from "../../../components/hallSeats";
import { prisma } from "../../../server/db/client";

export default AddEditHallSeats;

export async function getServerSideProps({ params }: any) {
  const cinemaHall = await prisma.cinemaHall.findUnique({
    where: {
      id: params.id,
    },
  });
  return {
    props: { cinemaHall },
  };
}
