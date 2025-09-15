export interface Courses {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  category_id: number;
  level: string;
  creation_date: Date;
  is_free: boolean;
  imgUrl: string;
}
