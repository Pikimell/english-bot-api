import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlanById,
  deletePlanById,
} from '../controllers/planControllers.js';

export const createPlanHandler = async (event, context) => {
  const ctrl = ctrlWrapper(createPlan);
  return await ctrl(event, context);
};

export const getAllPlansHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getAllPlans);
  return await ctrl(event, context);
};
export const getPlanByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(getPlanById);
  return await ctrl(event, context);
};

export const updatePlanByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(updatePlanById);
  return await ctrl(event, context);
};

export const deletePlanByIdHandler = async (event, context) => {
  const ctrl = ctrlWrapper(deletePlanById);
  return await ctrl(event, context);
};
