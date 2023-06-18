import './App.css';
import './fonts/Oswald-Light.ttf';
import { QueryClient, QueryClientProvider } from 'react-query';
import PostFlow from './PostFlow';
import React from 'react';

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