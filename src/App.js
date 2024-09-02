import React, { useState, useEffect } from 'react';
import { generateClient } from '@aws-amplify/api';
import {
  listBlogs,
  listPosts,
  listComments
} from './graphql/queries';
import {
  createBlog,
  updateBlog, 
  deleteBlog,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment
} from './graphql/mutations';
import './App.css';  // Import the CSS file

const client = generateClient();

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newBlogName, setNewBlogName] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchPosts();
    fetchComments();
  }, []);

  async function fetchBlogs() {
    const apiData = await client.graphql({ query: listBlogs });
    const blogsFromAPI = apiData.data.listBlogs.items;
    setBlogs(blogsFromAPI);
  }

  async function fetchPosts() {
    const apiData = await client.graphql({ query: listPosts });
    const postsFromAPI = apiData.data.listPosts.items;
    setPosts(postsFromAPI);
  }

  async function fetchComments() {
    const apiData = await client.graphql({ query: listComments });
    const commentsFromAPI = apiData.data.listComments.items;
    setComments(commentsFromAPI);
  }

  async function handleCreateBlog() {
    const input = { name: newBlogName };
    const result = await client.graphql({ query: createBlog, variables: { input } });
    const newBlog = result.data.createBlog;
    setBlogs([...blogs, newBlog]);
    setNewBlogName('');
  }

  async function handleCreatePost() {
    const input = { title: newPostTitle, blogPostsId: selectedBlogId };
    const result = await client.graphql({ query: createPost, variables: { input } });
    const newPost = result.data.createPost;
    setPosts([...posts, newPost]);
    setNewPostTitle('');
  }

  async function handleCreateComment() {
    const input = { content: newCommentContent, postCommentsId: selectedPostId };
    const result = await client.graphql({ query: createComment, variables: { input } });
    const newComment = result.data.createComment;
    setComments([...comments, newComment]);
    setNewCommentContent('');
  }

  async function handleUpdateBlog(id, name) {
    const input = { id, name };
    const result = await client.graphql({ query: updateBlog, variables: { input } });
    const updatedBlog = result.data.updateBlog;
    setBlogs(blogs.map((blog) => (blog.id === id ? updatedBlog : blog)));
  }

  async function handleUpdatePost(id, title) {
    const input = { id, title };
    const result = await client.graphql({ query: updatePost, variables: { input } });
    const updatedPost = result.data.updatePost;
    setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
  }

  async function handleUpdateComment(id, content) {
    const input = { id, content };
    const result = await client.graphql({ query: updateComment, variables: { input } });
    const updatedComment = result.data.updateComment;
    setComments(comments.map((comment) => (comment.id === id ? updatedComment : comment)));
  }

  async function handleDeleteBlog(id) {
    const input = { id };
    await client.graphql({ query: deleteBlog, variables: { input } });
    setBlogs(blogs.filter((blog) => blog.id !== id));
  }

  async function handleDeletePost(id) {
    const input = { id };
    await client.graphql({ query: deletePost, variables: { input } });
    setPosts(posts.filter((post) => post.id !== id));
  }

  async function handleDeleteComment(id) {
    const input = { id };
    await client.graphql({ query: deleteComment, variables: { input } });
    setComments(comments.filter((comment) => comment.id !== id));
  }

  return (
    <div className="container">
      <h1>Blogs</h1>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h2>{blog.name}</h2>
            <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
            <button onClick={() => handleUpdateBlog(blog.id, prompt("New name:"))}>Update</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newBlogName}
        onChange={(e) => setNewBlogName(e.target.value)}
        placeholder="New Blog Name"
      />
      <button onClick={handleCreateBlog}>Create Blog</button>

      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <button onClick={() => handleUpdatePost(post.id, prompt("New title:"))}>Update</button>
          </li>
        ))}
      </ul>
      <select onChange={(e) => setSelectedBlogId(e.target.value)}>
        <option value="">Select a Blog</option>
        {blogs.map((blog) => (
          <option key={blog.id} value={blog.id}>{blog.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        placeholder="New Post Title"
      />
      <button onClick={handleCreatePost}>Create Post</button>

      <h1>Comments</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            <button onClick={() => handleUpdateComment(comment.id, prompt("New content:"))}>Update</button>
          </li>
        ))}
      </ul>
      <select onChange={(e) => setSelectedPostId(e.target.value)}>
        <option value="">Select a Post</option>
        {posts.map((post) => (
          <option key={post.id} value={post.id}>{post.title}</option>
        ))}
      </select>
      <input
        type="text"
        value={newCommentContent}
        onChange={(e) => setNewCommentContent(e.target.value)}
        placeholder="New Comment Content"
      />
      <button onClick={handleCreateComment}>Create Comment</button>
    </div>
  );
};

export default App;
