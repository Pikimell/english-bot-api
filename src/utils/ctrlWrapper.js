import { initMongoDB } from '../db/initMongoDb.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { parseJson } from '../middleware/jsonBody.js';

export const ctrlWrapper = (controller, ...middleware) => {
  return async (event, context) => {
    try {
      await initMongoDB();

      parseJson(event);

      for (const callback of middleware) {
        await callback(event, context);
      }

      return await controller(event, context);
    } catch (err) {
      return errorHandler(err);
    }
  };
};
