import { postServices } from '../services/postServices';
import { response } from '../utils/response';

export const createPost = async (event) => {
  const data = event.body;
  const newPost = await postServices.createPost(data);
  return response(201)(newPost);
};

export const getPostById = async (event) => {
  const { id } = event.pathParameters;
  const post = await postServices.getPostById(id);

  if (!post) {
    return response(404)({ message: 'Post not found' });
  }

  return response(200)(post);
};

export const getAllPosts = async () => {
  const posts = await postServices.getAllPosts();
  return response(200)(posts);
};

export const getPostsByTopic = async (event) => {
  const { topic } = event.queryStringParameters;
  const posts = await postServices.getPostsByTopic(topic);
  return response(200)(posts);
};

export const updatePostById = async (event) => {
  const { id } = event.pathParameters;
  const updateData = event.body;

  const updatedPost = await postServices.updatePostById(id, updateData);

  if (!updatedPost) {
    return response(404)({ message: 'Post not found' });
  }

  return response(200)(updatedPost);
};

export const deletePostById = async (event) => {
  const { id } = event.pathParameters;
  const deletedPost = await postServices.deletePostById(id);

  if (!deletedPost) {
    return response(404)({ message: 'Post not found' });
  }

  return response(200)({ message: 'Post deleted successfully' });
};
