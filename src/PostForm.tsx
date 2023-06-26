import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { usePostStore } from './Store';

interface User {
    id: number;
    username: string;
}

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
    username: string;
}

interface PostFormProps {
    onSubmit: (post: Post) => void;
}

const postSchema = z.object({
    title: z.string().nonempty('Title is required'),
    body: z.string().nonempty('Body is required'),
    username: z.string().nonempty('Username is required'),
});

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [username, setUsername] = useState('');
    const [formError, setFormError] = useState('');

    const createPostMutation = useMutation(async (newPost: Post) => {
        // Simulate the creation of a post
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(newPost);
            }, 1000);
        });
    });

    const addPostToStore = usePostStore((state) => state.addPost);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const validatedPost = postSchema.parse({ title, body, username });

            const newPost: Post = {
                id: Date.now(),
                userId: 1, // Provide a valid user ID
                title: validatedPost.title,
                body: validatedPost.body,
                username: validatedPost.username,
            };

            await createPostMutation.mutateAsync(newPost);
            console.log('Post created successfully');
            onSubmit(newPost);
            addPostToStore(newPost);
            setTitle('');
            setBody('');
            setUsername('');
            setFormError('');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.errors[0];
                setFormError(firstError.message);
            } else {
                console.error('Failed to create post:', error);
                setFormError('Failed to create post');
            }
        }
    };


    if (createPostMutation.isLoading) {
        return <div>Creating post...</div>;
    }

    if (createPostMutation.isError) {
        return <div>Error creating post</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            {formError && <div>{formError}</div>}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;
