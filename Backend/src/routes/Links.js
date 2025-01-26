import express from 'express';
import verifyToken from '../middlewares/Verify.js';
import {
  createLink,
  getLinks,
  updateLinkStatus,
  deleteLink,
  redirectAndTrackClicks,
  getLinkAnalytics
} from '../controller/LinksController.js';

const router = express.Router();

// Create a new short link
router.post('/create-link', verifyToken, createLink);

// Get all links for a user
router.get('/get-links', verifyToken, getLinks);

// Update link status (active/inactive)
router.patch('/:id/status', verifyToken, updateLinkStatus);

// Delete a link
router.delete('/:id', verifyToken, deleteLink);

// Redirect and track clicks
router.get('/:shortCode',  redirectAndTrackClicks);

// Get analytics for a specific link
router.get('/:id/analytics', verifyToken, getLinkAnalytics);

export default router;
