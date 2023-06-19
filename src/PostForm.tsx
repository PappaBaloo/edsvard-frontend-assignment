import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { usePostStore } from './Store';

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

// Define a schema for validating the post data
const postSchema = z.object({
    title: z.string().nonempty('Title is required'),
    body: z.string().nonempty('Body is required'),
});

/**
 * Component that represents a form for creating a post.
 * @param onSubmit Callback function when the form is submitted with a valid post.
 */
const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [formError, setFormError] = useState('');

    const createPostMutation = useMutation(async (newPost: Post) => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        return response.json();
    });

    /**
     * Handles the form submission event.
     * @param event The form submission event.
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const validatedPost = postSchema.parse({ title, body });

            const newPost: Post = {
                id: Date.now(), // Generate a temporary ID for the new post
                userId: 1, // Provide a valid user ID
                title: validatedPost.title,
                body: validatedPost.body,
                username: '', // The username will be fetched later when displaying the post
            };

            await createPostMutation.mutateAsync(newPost);
            console.log('Post created successfully');
            onSubmit(newPost);
            setTitle('');
            setBody('');
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
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;
