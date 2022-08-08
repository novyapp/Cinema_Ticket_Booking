export interface seatsType {
  length: ReactNode;
}

export interface LayoutType {
  title: string;
  description: string;
  keywords: string;
  children: JSX.Element;
}
export interface movieType {
  id: string;
  name: string;
  takenSeats: Array[];
}
