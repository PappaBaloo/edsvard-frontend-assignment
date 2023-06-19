import create from 'zustand';
import axios, { AxiosError } from 'axios';

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface PostStoreState {
  posts: Post[];
  createPost: (post: Post) => Promise<Post>;
}

export const usePostStore = create<PostStoreState>((set) => ({
  posts: [],
  createPost: async (post) => {
    try {
      // Make API call to create a post
      const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', post);

      // Update the store's posts array with the new post
      set((state) => ({
        ...state,
        posts: [...state.posts, response.data],
      }));

      return response.data;
    } catch (error) {
      throw error as AxiosError;
    }
  },
}));