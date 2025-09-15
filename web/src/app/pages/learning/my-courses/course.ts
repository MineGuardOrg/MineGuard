export interface Course {
  id: number;
  title?: string;
  description?: string;
  instructorId?: number;
  instructorName?: string;
  categories?: CategoryDto[];
  level?: string;
  cost?: number;
  imgUrl?: string | null;
  createdDate?: string;
  lessonCourseDtos?: LessonCourseDto[];
}

export interface CategoryDto {
  id: number;
  name: string;
  courseDtos?: Course[];
}

export interface LessonCourseDto {
  id: number;
  title?: string;
  lessonDtos?: LessonDto[];
}

export interface LessonDto {
  id: number;
  title?: string;
  description?: string;
  courseTitle?: string;
  order?: number;
  resources?: ResourceDto[];
  lessonCourseId?: number;
}

export interface ResourceDto {
  id: number;
  fileName?: string;
  fileUrl?: string;
  lessonId?: number;
}