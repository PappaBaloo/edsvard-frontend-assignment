import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { create } from 'zustand';

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface User {
    id: number;
    username: string;
}

interface PostFlowProps {
    onPostSelect: (post: Post) => void;
}

interface PostFlowState {
    selectedPost: Post | null;
    posts: Post[];
    selectPost: (post: Post) => void;
    addPost: (post: Post) => void;
}

const usePostStore = create<PostFlowState>((set) => ({
    selectedPost: null,
    posts: [],
    selectPost: (post) => set(() => ({ selectedPost: post })),
    addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));

const PostFlow: React.FC<PostFlowProps> = ({ onPostSelect }) => {
    const selectedPost = usePostStore((state) => state.selectedPost);
    const posts = usePostStore((state) => state.posts);
    const selectPost = usePostStore((state) => state.selectPost);

    const [usersData, setUsersData] = useState<User[]>([]);

    const fetchUsers = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsersData(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchPosts = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        return data;
    };

    const { data, isError, isLoading } = useQuery<Post[]>('posts', fetchPosts);

    useEffect(() => {
        if (data && usersData) {
            const postWithUsernames = data.map((post) => {
                const user = usersData.find((user) => user.id === post.userId);
                const username = user ? user.username : '';
                return { ...post };
            });
            usePostStore.setState({ posts: postWithUsernames });
        }
    }, [data, usersData]);

    const handlePostClick = (post: Post) => {
        selectPost(post);
        onPostSelect(post);
    };

    if (isError) {
        return <div>Error fetching posts</div>;
    }

    if (isLoading || data === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className="postFlow">
            {posts.map((post) => (
                <div key={post.id} onClick={() => handlePostClick(post)}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
};

export default PostFlow;
