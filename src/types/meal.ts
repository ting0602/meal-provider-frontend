// types/meal.ts
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: Array<'推薦' | '主食' | '副餐' | '其他'>;
  likeCount: number;
  dislikeCount: number;
};
