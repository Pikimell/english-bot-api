import { initMongoDB } from '../db/initMongoDb.js';
import { initCommandControllers } from './controllers/commandControllers.js';
import { initMainControllers } from './controllers/mainControllers.js';
import { initPaymentControllers } from './controllers/paymentController.js';
import { initStudentControllers } from './controllers/studentController.js';
import { initTeacherControllers } from './controllers/teacherController.js';

const options = {
  isActive: false,
};
export async function initBot() {
  await initMongoDB();
  if (options.isActive) {
    console.log('BOT is Active Already');
    return;
  }
  initCommandControllers();
  initStudentControllers();
  initTeacherControllers();
  initPaymentControllers();
  initMainControllers();
  options.isActive = true;
}

initBot();
