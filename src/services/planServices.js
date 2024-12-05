import { PlanCollection } from '../db/models/plan.js';

// Create a new plan
export const createPlan = async (planData) => {
  const newPlan = new PlanCollection(planData);
  return await newPlan.save();
};

// Read (get) all plans
export const getAllPlans = async () => {
  return await PlanCollection.find();
};

// Read (get) a single plan
export const getPlanByLevel = async (level) => {
  const plan = await PlanCollection.find({ level });
  if (!plan) {
    throw new Error('Plan not found');
  }
  return plan;
};
// Read (get) a single plan
export const getPlanById = async (id) => {
  const plan = await PlanCollection.findById(id);
  if (!plan) {
    throw new Error('Plan not found');
  }
  return plan;
};

// Update a plan by ID
export const updatePlanById = async (planId, updatedData) => {
  const updatedPlan = await PlanCollection.findByIdAndUpdate(
    planId,
    updatedData,
    { new: true },
  );
  if (!updatedPlan) {
    throw new Error('Plan not found for update');
  }
  return updatedPlan;
};

// Delete a plan by ID
export const deletePlanById = async (planId) => {
  const deletedPlan = await PlanCollection.findByIdAndDelete(planId);
  if (!deletedPlan) {
    throw new Error('Plan not found for deletion');
  }
  return deletedPlan;
};
