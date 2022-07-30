import React from "react";

export default function Seat({
  selectedSeats,
  movie,
  seatsIn,
  handleSelectedState,
}) {
  console.log("seat", movie);

  const createSeats = (
    rows: number,
    startIndex: number | any,
    endIndex: string
  ) => {
    let i = 0;
    let j = startIndex;
    let k = "A";
    let eI = endIndex + 1;
    const section = [];
    while (i < 6 && j <= rows) {
      if (k > eI) {
        k = "A";
        j++;
      }
      if (j < rows + 1) {
        section.push(j + k);
        k = String.fromCharCode(k.charCodeAt(0) + 1);
      }
    }
    return section;
  };
  function intToChar(int) {
    const code = "A".charCodeAt(0);
    return String.fromCharCode(code + int);
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      {seatsIn.map((seatsTypes) => {
        const nti = intToChar(seatsTypes.numberOfSeats - 1);
        const hallSeaction = createSeats(seatsTypes.numberOfRows, "1", nti);

        return (
          <div className={`grid grid-cols-${seatsTypes.numberOfSeats} gap-2`}>
            {/* <div>{seatsTypes.name}</div> */}
            {hallSeaction.map((seat) => {
              const isSelected = selectedSeats.includes(seat);
              const isOccupied = movie?.takenSeats.includes(seat);

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
        );
      })}
    </div>
  );
}
