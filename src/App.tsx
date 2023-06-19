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
  const handlePostCreate = (post: Post) => {
    // Add the new post logic here, such as updating the state or sending additional API requests
    console.log('Created post:', post);
  };

  // Handles the selection of a post
  // Param 'Post' The selected post object
  const handlePostSelect = (post: Post) => {
    // Handle post selection logic here
    console.log('Selected post:', post);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mainContainer">
        <PostForm onSubmit={handlePostCreate} />
        <PostFlow onPostSelect={handlePostSelect} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
