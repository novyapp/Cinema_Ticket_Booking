import React from "react";

function Cinema({
  movie,
  numberOfSeats,
  selectedSeats,
  onSelectedSeatsChange,
}: CinemaType) {
  function handleSelectedState(seat: string) {
    const seatsToBook = parseInt(numberOfSeats as string, 10);
    const isSelected = selectedSeats.includes(seat);

    const test = numberOfSeats;
    console.log(test);

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
  console.log("cinema", movie);
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {premiumSeats.map((seat) => {
            const isSelected = selectedSeats.includes(seat);
            const isOccupied = movie.takenSeats.includes(seat);

            return (
              <span
                key={seat}
                className={`bg-zinc-300 w-10 h-10 text-zinc-500 flex items-center justify-center font-semibold rounded-md ${
                  isSelected &&
                  "bg-gradient-to-t from-pink-700 to-pink-500 !text-white "
                } ${
                  isOccupied &&
                  "!bg-zinc-800 pointer-events-none !text-zinc-700"
                }`}
                onClick={isOccupied ? null : () => handleSelectedState(seat)}
              >
                {seat}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
