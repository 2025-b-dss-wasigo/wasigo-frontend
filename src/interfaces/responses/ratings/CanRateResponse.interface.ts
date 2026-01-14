export interface UserToRate {
  userId: string;
  name: string;
}

export interface CanRateResponse {
  canRate: boolean;
  usersToRate: UserToRate[];
}
