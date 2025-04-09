import express from 'express';
import {
  createContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = express.Router();

const jsonParser = express.json();
router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
