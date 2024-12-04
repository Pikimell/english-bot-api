import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createPost,
  getPostById,
  getAllPosts,
  getPostsByTopic,
  updatePostById,
  deletePostById,
} from '../controllers/postControllers.js';

export const createPostHandler = async (event, context) => {
  const ctrl = ctrlWrapper(createPost);
  return await ctrl(event, context);
};

export const getPostByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getPostById);
  return await ctrl(event, context);
};

export const getAllPostsHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getAllPosts);
  return await ctrl(event, context);
};

export const getPostsByTopicHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getPostsByTopic);
  return await ctrl(event, context);
};

export const updatePostByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updatePostById);
  return await ctrl(event, context);
};

export const deletePostByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(deletePostById);
  return await ctrl(event, context);
};
