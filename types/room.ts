export type RoomType = "Sencilla" | "Doble" | "VIP" | "Triple";

export interface Room {
  roomNumber: string;
  roomType: RoomType;
  price: number;
}
