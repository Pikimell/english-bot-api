import {
  createPlan as createPlanS,
  getAllPlans as getAllPlansS,
  updatePlanById as updatePlanByIdS,
  deletePlanById as deletePlanByIdS,
} from '../services/planServices';
import { response } from '../utils/response';

export const createPlan = async (event) => {
  const data = event.body;
  const newPlan = await createPlanS(data);
  return response(201)(newPlan);
};

export const getAllPlans = async () => {
  const plans = await getAllPlansS();
  return response(200)(plans);
};

export const updatePlanById = async (event) => {
  const { id } = event.pathParameters;
  const updateData = event.body;
  const updatedPlan = await updatePlanByIdS(id, updateData);

  if (!updatedPlan) {
    return response(404)({ message: 'Plan not found' });
  }

  return response(200)(updatedPlan);
};

export const deletePlanById = async (event) => {
  const { id } = event.pathParameters;
  const deletedPlan = await deletePlanByIdS(id);

  if (!deletedPlan) {
    return response(404)({ message: 'Plan not found' });
  }

  return response(200)({ message: 'Plan deleted successfully' });
};
