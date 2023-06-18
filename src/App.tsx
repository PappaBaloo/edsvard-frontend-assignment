import './App.css'
import './fonts/Oswald-Light.ttf';
import { QueryClient, QueryClientProvider } from 'react-query';
import PostFlow from './PostFlow';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostFlow />
    </QueryClientProvider>
  );
}

export default App;