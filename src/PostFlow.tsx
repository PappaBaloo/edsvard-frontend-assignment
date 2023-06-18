import React from 'react';
import { useQuery } from 'react-query';
import create from 'zustand';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
    username: string;
}

interface User {
    id: number;
    username: string;
}

interface PostStore {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
}

const usePostStore = create<PostStore>((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
}));

const PostFlow: React.FC = () => {
    const posts = usePostStore((state) => state.posts);
    const setPosts = usePostStore((state) => state.setPosts);

    const { data: usersData } = useQuery<User[]>('users', async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    });

    const { data, isError, isLoading } = useQuery<Post[]>('posts', async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    });

    React.useEffect(() => {
        if (data && usersData) {
            const postWithUsernames = data.map((post) => {
                const user = usersData.find((user) => user.id === post.userId);
                const username = user ? user.username : '';
                return { ...post, username };
            })
            setPosts(postWithUsernames);
        }
    }, [data, usersData, setPosts]);

    if (isError) {
        return <div>Error fetching posts</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mainContainer">
            <div className="postFlow">
                {posts.map((post) => (
                    <div key={post.id}>
                        <h3>{post.username}</h3>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostFlow;