import { initMongoDB } from '../db/initMongoDb.js';
import { initCommandControllers } from './controllers/commandControllers.js';
import { initMainControllers } from './controllers/mainControllers.js';
import { initStudentControllers } from './controllers/studentController.js';

async function initBot() {
  await initMongoDB();
  initCommandControllers();
  initStudentControllers();
  initMainControllers();
}

initBot();
