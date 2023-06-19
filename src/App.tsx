import './App.css';
import './fonts/Oswald-Light.ttf';
import { QueryClient, QueryClientProvider } from 'react-query';
import PostFlow from './PostFlow';
import PostForm from './PostForm';
import React from 'react';
import { useState } from 'react';
import { usePostStore } from './Store';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  username: string;
}

const queryClient = new QueryClient();

// The main component representing the application
function App() {
  /*   const [posts, setPosts] = useState<Post[]>([]);
  
    const handlePostCreate = async (post: Post) => {
      try {
        // Create the post using the store's createPost function
        const createdPost = await usePostStore.getState().createPost(post);
  
        // Add the new post to the beginning of the posts array
        setPosts([createdPost, ...posts]);
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    }; */

  // Handles the selection of a post
  // Param 'Post' The selected post object
  const handlePostSelect = (post: Post) => {
    // Handle post selection logic here
    console.log('Selected post:', post);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mainContainer">
        <PostFlow onPostSelect={handlePostSelect} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
