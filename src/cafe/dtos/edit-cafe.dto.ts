export default interface EditCafeDTO {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  openHour?: number;
  openMinute?: number;
  closeHour?: number;
  closeMinute?: number;
  closeDay?: string;
}
