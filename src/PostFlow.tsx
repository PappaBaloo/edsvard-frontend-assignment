import { shuffle } from 'lodash';
import React, { useEffect, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import create from 'zustand';

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

interface PostFlowProps {
    onPostSelect: (post: Post) => void;
}

interface PostFlowState {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    selectedPost: Post | null;
    selectPost: (post: Post) => void;
}

const usePostStore = create<PostFlowState>((set) => ({
    posts: [],
    setPosts: (posts) => set(() => ({ posts })),
    selectedPost: null,
    selectPost: (post) => set(() => ({ selectedPost: post })),
}));

// Component for displaying the flow of posts and handling post selection

const PostFlow: React.FC<PostFlowProps> = ({ onPostSelect }) => {
    // Retrieve posts state and functions from the store
    const posts = usePostStore((state) => state.posts);
    const setPosts = usePostStore((state) => state.setPosts);
    const selectedPost = usePostStore((state) => state.selectedPost);
    const selectPost = usePostStore((state) => state.selectPost);

    // Perform API request to fetch the users
    const { data: usersData } = useQuery<User[]>('users', async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    });

    // Perform an infinite query to fetch posts
    const fetchPosts = async ({ pageParam = 1 }) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=20`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    };

    const { data, isError, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery('posts', fetchPosts, {
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) {
                return undefined; // Stop fetching if the last page is empty
            }
            return pages.length + 1; // Return the next page number to fetch
        },
    });

    // Update the state when data and usersData are available
    useEffect(() => {
        if (data && usersData) {
            const allPosts = data.pages.flatMap((page) => page);
            const randomPosts = shuffle(allPosts).slice(0, 20);
            const postWithUsernames = randomPosts.map((post) => {
                const user = usersData.find((user) => user.id === post.userId);
                const username = user ? user.username : '';
                return { ...post, username };
            });
            setPosts(postWithUsernames);
        }
    }, [data, usersData, setPosts]);

    if (isError) {
        return <div>Error fetching posts</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Handle scrolling event for infinite scrolling
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            fetchNextPage();
        }
    }, [fetchNextPage]);

    useEffect(() => {
        if (!isLoading) {
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isLoading, handleScroll]);

    // Handles the click event when a post is clicked
    // @param post The clicked post object
    const handlePostClick = (post: Post) => {
        selectPost(post);
        onPostSelect(post);
    };

    // Render the component
    return (
        <div className="postFlow">
            {posts.map((post) => (
                <div key={post.id} onClick={() => handlePostClick(post)}>
                    <h3>{post.username}</h3>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
            {/* Show loading indicator when fetching more posts */}
            {isLoading && <div>Loading more posts...</div>}

            {/* Show end message when all posts are loaded */}
            {!isLoading && !hasNextPage && <div>End of posts</div>}

            {/* Show selected post */}
            {selectedPost && (
                <div className="selectedPost">
                    <h3>{selectedPost.username}</h3>
                    <h2>{selectedPost.title}</h2>
                    <p>{selectedPost.body}</p>
                </div>
            )}
        </div>
    );
};

export default PostFlow;