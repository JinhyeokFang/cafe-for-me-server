export default interface CreateReviewDTO {
  cafeId: string;
  uploaderId: string;
  rate: number;
  comment: string;
  images: string[];
}
