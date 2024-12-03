import { model, Schema } from 'mongoose';

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    topic: { type: String },
    hashtags: [{ type: String }],
  },
  { timestamps: true, versionKey: false },
);

postSchema.index({ topic: 1 });
postSchema.index({ hashtags: 1 });

export const PostCollection = model('Post', postSchema);
