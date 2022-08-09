import React from "react";
import Seat from "./Seat";

export default function Cinema({
  movie,
  numberOfSeats,
  selectedSeats,
  onSelectedSeatsChange,
}: {
  movie: object | undefined;
  numberOfSeats: string;
  selectedSeats: string[];
  onSelectedSeatsChange: Function;
}) {
  function handleSelectedState(seat: string) {
    const seatsToBook = parseInt(numberOfSeats, 10);
    const isSelected = selectedSeats.includes(seat);

    if (seatsToBook >= selectedSeats.length) {
      if (isSelected) {
        onSelectedSeatsChange(
          selectedSeats.filter((selectedSeat: string) => selectedSeat !== seat)
        );
      } else if (selectedSeats.length === seatsToBook) {
        selectedSeats.shift();
        onSelectedSeatsChange([...selectedSeats, seat]);
      } else {
        onSelectedSeatsChange([...selectedSeats, seat]);
      }
    } else if (seatsToBook < selectedSeats.length) {
      const slice = selectedSeats.slice(0, seatsToBook);
      slice.shift();
      onSelectedSeatsChange([...slice, seat]);
    }
  }
  if (!movie) return null;
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <Seat
          movie={movie}
          handleSelectedState={handleSelectedState}
          selectedSeats={selectedSeats}
        />
      </div>
    </>
  );
}
