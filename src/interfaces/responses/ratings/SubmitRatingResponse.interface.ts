export interface SubmitRatingRequest {
  routeId: string;
  toUserId: string;
  score: number;
  comment: string;
}

export interface SubmitRatingResponse {
  ratingId: string;
  routeId: string;
  toUserId: string;
  score: number;
  comment: string;
  createdAt: string;
}
