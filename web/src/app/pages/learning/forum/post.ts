export interface PostComment {
  postCommentId: number;
  content: string;
  createdName: string;
  createdDate: string;
}

export interface Post {
  postId: number;
  title: string;
  content: string;
  createdDate: string;
  createdBy: string;
  postComment: PostComment[];
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}