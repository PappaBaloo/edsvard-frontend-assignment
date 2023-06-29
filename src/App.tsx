import './App.css';
import './fonts/Oswald-Light.ttf';
import { QueryClient, QueryClientProvider } from 'react-query';
import PostFlow from './PostFlow';
import PostForm from './PostForm';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface FormPost {
  userId: number;
  title: string;
  body: string;
}

// Create a new instance of QueryClient
const queryClient = new QueryClient();

/**
 * The main component representing the application.
 */
function App(): JSX.Element {
  // Handles the event when a new post is created
  const handlePostCreate = (post: FormPost): void => {
    // Add the logic to handle the new post, such as updating the state or sending additional API requests
    console.log('Created post:', post);
  };

  /**
   * Handles the selection of a post.
   * @param post The selected post object.
   */
  const handlePostSelect = (post: Post): void => {
    // Handle the logic for post selection here
    console.log('Selected post:', post);
  };

  return (
    // Wraps the app with QueryClientProvider to enable react-query functionality
    <QueryClientProvider client={queryClient}>
      <div className="mainContainer">
        {/* Renders the PostForm component */}
        <PostForm onSubmit={handlePostCreate} />
        {/* Renders the PostFlow component */}
        <PostFlow onPostEdit={handlePostSelect} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
