import { PostCollection } from '../db/models/post.js';

export const postServices = {
  createPost: async (data) => {
    const post = new PostCollection(data);
    return await post.save();
  },

  getPostById: async (postId) => {
    return await PostCollection.findById(postId);
  },

  getAllPosts: async (filter = {}) => {
    return await PostCollection.find(filter);
  },

  getPostsByTopic: async (topic) => {
    return await PostCollection.find({ topic });
  },

  updatePostById: async (postId, updateData) => {
    return await PostCollection.findByIdAndUpdate(postId, updateData, {
      new: true,
    });
  },

  deletePostById: async (postId) => {
    return await PostCollection.findByIdAndDelete(postId);
  },
};
