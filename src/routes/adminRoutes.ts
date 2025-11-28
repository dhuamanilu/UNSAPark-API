import { Router } from 'express';
import { getPendingRequests, updateRequestStatus } from '../controllers/adminController';

const router = Router();

// GET http://localhost:3000/api/admin/pending
router.get('/pending', getPendingRequests);

// PUT http://localhost:3000/api/admin/requests/:id
router.put('/requests/:id', updateRequestStatus);

export default router;