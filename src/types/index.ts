export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categories?: string[];
  tags?: string[];
  isFavorite?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}