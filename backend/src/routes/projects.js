const express = require('express');
const { createProject, getProjects, getProjectById, likeProject, addComment, investInProject, crowdfundProject } = require('../controllers/projectController');
const { negotiateInvestment, respondToNegotiation } = require('../controllers/negotiateInvestment');
const aiAnalysis = require('../controllers/aiAnalysis');

const router = express.Router();

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/posts/:id/like', likeProject);
router.post('/posts/:id/comments', addComment);
router.post('/posts/:id/invest', investInProject);
router.post('/posts/:id/crowdfund', crowdfundProject);
router.post('/ai-analysis', aiAnalysis);
router.post('/posts/:id/negotiate', negotiateInvestment);
router.post('/posts/:projectId/negotiate/:requestId/respond', respondToNegotiation);

module.exports = router;