import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { usePostStore } from './Store';
import { AxiosError } from 'axios';

interface FormData {
    title: string;
    body: string;
}

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

const schema = z.object({
    title: z.string().nonempty('Title is required'),
    body: z.string().nonempty('Body is required'),
});

const PostForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const createPostMutation = useMutation<Post, AxiosError, FormData>((data) =>
        usePostStore.getState().createPost(data as Post)
    );

    const handleFormSubmit = handleSubmit((data) => {
        try {
            const validatedData = schema.parse(data);
            createPostMutation.mutate(validatedData);
        } catch (error) {
            console.error('Form validation error:', error);
        }
    });

    const handleReset = () => {
        reset();
    };

    return (
        <div className='createPost'>
            <form className="postForm" onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    {...register('title', { required: true })}
                />
                {errors.title && <span>{errors.title.message}</span>}
                <textarea
                    placeholder="Body"
                    {...register('body', { required: true })}
                />
                {errors.body && <span>{errors.body.message}</span>}
                <div>
                    <button type="submit">Create Post</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;