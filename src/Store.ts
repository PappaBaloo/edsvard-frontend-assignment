import { create } from 'zustand';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  username: string;
}

interface PostFlowState {
  selectedPost: Post | null;
  posts: Post[];
  selectPost: (post: Post) => void;
  addPost: (post: Post) => void; // Add this line
}

export const usePostStore = create<PostFlowState>((set) => ({
  selectedPost: null,
  posts: [],
  selectPost: (post) => set(() => ({ selectedPost: post })),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })), // Add this function
}));