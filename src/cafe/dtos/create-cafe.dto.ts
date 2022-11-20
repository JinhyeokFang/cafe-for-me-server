export default interface CreateCafeDTO {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
  closeDay: string;
  images: string[];
  uploaderId: string;
  tags: string[];
}
