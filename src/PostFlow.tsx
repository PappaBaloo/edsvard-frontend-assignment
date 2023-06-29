import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface UserInformation {
    id: number;
    username: string;
}

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

const getUserInformation = async (userId: number): Promise<UserInformation> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user information');
    }
    return response.json();
};

interface PostFlowProps {
    onPostEdit: (post: Post) => void;
}

const PostFlow: React.FC<PostFlowProps> = ({ onPostEdit }) => {
    const { data: posts, isLoading, isError } = useQuery<Post[]>('posts', async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    });

    const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers } = useQuery<UserInformation[]>(
        'users',
        async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Failed to fetch user information');
            }
            return response.json();
        }
    );

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const getUserUsername = (userId: number): string => {
        const user = users?.find((user) => user.id === userId);
        return user?.username || '';
    };

    const handlePostEdit = (post: Post): void => {
        setSelectedPost(post);
        // Perform any additional logic for editing the post, such as opening a modal or navigating to an edit page
        console.log('Editing post:', post);
        onPostEdit(post); // Notify the parent component about the post edit
    };

    if (isLoading || isLoadingUsers) {
        return <div>Loading posts...</div>;
    }

    if (isError || isErrorUsers) {
        return <div>Error fetching posts</div>;
    }

    return (
        <div>
            {posts?.map((post) => (
                <div key={post.id}>
                    <p>Username: {getUserUsername(post.userId)}</p>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <button onClick={() => handlePostEdit(post)}>Edit</button>
                </div>
            ))}
        </div>
    );
};

export default PostFlow;
