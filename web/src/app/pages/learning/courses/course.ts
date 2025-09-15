export interface Course {
  id: number;
  title: string;
  description: string;
  teacherName: string;
  categories: { id: number; name: string; courseDtos: any[] }[];
  level: string;
  createdDate: string;
  cost: number;
  imgUrl: string;
  reviewCount: number;
  averageRating: number;
}
