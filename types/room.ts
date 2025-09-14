export interface Room {
  number: string;
  type: "Sencilla" | "Doble";
}

export const rooms: Room[] = [
  { number: "101", type: "Sencilla" },
  { number: "102", type: "Sencilla" },
  { number: "103", type: "Sencilla" },
  { number: "104", type: "Sencilla" },
  { number: "201", type: "Doble" },
  { number: "202", type: "Doble" },
  { number: "203", type: "Doble" },
];
