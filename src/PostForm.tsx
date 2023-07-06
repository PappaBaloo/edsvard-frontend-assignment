import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';

interface FormPost {
    userId: number;
    title: string;
    body: string;
}

interface PostFormProps {
    onSubmit: (post: FormPost) => void;
}

const postSchema = z.object({
    title: z.string().nonempty('Title is required'),
    body: z.string().nonempty('Body is required'),
    userId: z.number().min(1, 'User ID must be greater than 0'),
});

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');
    const [formError, setFormError] = useState('');

    const queryClient = useQueryClient();

    const createPostMutation = useMutation(async (newPost: FormPost) => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        return response.json();

    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const validatedPost = postSchema.parse({ title, body, userId: parseInt(userId) });

            const newPost: FormPost = {
                userId: validatedPost.userId,
                title: validatedPost.title,
                body: validatedPost.body,
            };

            await createPostMutation.mutateAsync(newPost);
            console.log('Post created successfully');
            onSubmit(newPost);
            setTitle('');
            setBody('');
            setUserId('');
            setFormError('');
            queryClient.invalidateQueries('posts'); // Trigger a refetch of the 'posts' query
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
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
            <input type="number" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;
