import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import {
  createCategoryValidationRules,
  updateCategoryValidationRules,
} from '../utils/validations';
import { validate } from '../utils/validations';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';

const router = Router();

// Crud
router
  .route('/')
  .post(
    adminAuthMiddleware,
    createCategoryValidationRules(),
    validate,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .put(
    adminAuthMiddleware,
    updateCategoryValidationRules(),
    validate,
    categoryController.updateCategory
  )
  .delete(adminAuthMiddleware, categoryController.deleteCategory);

router.patch(
  '/:id/toggle-status',
  adminAuthMiddleware,
  categoryController.toggleCategoryStatus
);

export default router;
