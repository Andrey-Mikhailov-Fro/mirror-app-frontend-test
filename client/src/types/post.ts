export interface User {
  id: string;
  username: string;
  postId: string;
}

export interface Post {
  caption: string;
  id: string;
  comments: number;
  likes: number;
  date: string;
  permalink: string;
  userId: string;
  user: User;
}

export type CardVariant = "classic" | "hover";