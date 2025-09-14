export type Room = {
  number: string;
  type: "Sencilla" | "Doble";
  price: number;
};

export const rooms: Room[] = [
  { number: "101", type: "Sencilla", price: 1500 },
  { number: "102", type: "Sencilla", price: 1500 },
  { number: "103", type: "Sencilla", price: 1500 },
  { number: "201", type: "Doble", price: 2500 },
  { number: "202", type: "Doble", price: 2500 },
  { number: "203", type: "Doble", price: 2500 },
];
