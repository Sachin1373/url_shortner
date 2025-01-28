import express from 'express';
import verifyToken from '../middlewares/Verify.js';
import {
  createLink,
  getLinks,
  getLink,
  updateLinkStatus,
  deleteLink,
  editLink,
  getLinksByRemarks,
  redirectAndTrackClicks,
  getClickAnalytics,
  getLinkClicks
} from '../controller/LinksController.js';

const router = express.Router();


router.post('/create-link', verifyToken, createLink);
router.get('/get-links', verifyToken, getLinks);
router.get('/getlink/:id', verifyToken, getLink);
router.get('/getlinkclicks', verifyToken, getLinkClicks);
router.get('/getlinksbyremarks/:remarks', verifyToken, getLinksByRemarks);
router.get('/getclickanalytics', verifyToken, getClickAnalytics);
router.patch('/:id/status', verifyToken, updateLinkStatus);
router.patch('/edit/:id', verifyToken, editLink);
router.delete('/delete/:id', verifyToken, deleteLink);
router.get('/redirect/:shortCode', verifyToken,  redirectAndTrackClicks);


export default router;
