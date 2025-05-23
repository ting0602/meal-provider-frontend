export type OrderItem = {
  mealId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  userId: string;
  items: OrderItem[];
};