import React from "react";

export default function SeatAdmin({ seatsIn, deleteSeats, updateSeatRow }) {
  const createSeats = (rows: number, startIndex: number, endIndex: string) => {
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
  let initRow = 0;
  let initInd = 1;

  return (
    <div className="flex flex-col items-center space-y-8">
      {seatsIn.map((seatsTypes, i, array) => {
        const nti = intToChar(seatsTypes.numberOfSeats - 1);
        const prev = array[i - 1];

        const numOfRows = (initRow += seatsTypes.numberOfRows);
        const indexRows = i === 0 ? initInd : (initInd += prev.numberOfRows);

        function getNumofCols() {
          const num = seatsTypes.numberOfSeats;
          return "grid-cols-" + num;
        }

        const fd = `grid gap-2 ${getNumofCols()}`;
        const hallSeaction = createSeats(numOfRows, indexRows, nti);

        return (
          <div
            key={seatsTypes.id}
            className="flex flex-row space-x-6 items-center"
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold">Name:</span>{" "}
              <span>{seatsTypes.name}</span>
            </div>
            <div className={fd}>
              {hallSeaction.map((seat, i) => {
                return (
                  <span
                    key={seat}
                    className={`bg-zinc-300 w-10 h-10 text-zinc-500 flex items-center justify-center font-semibold rounded-md `}
                  >
                    {seat}
                  </span>
                );
              })}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => updateSeatRow(seatsTypes)}
                className="bg-orange-600 p-2 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSeats(seatsTypes.id)}
                className="bg-red-600 p-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
