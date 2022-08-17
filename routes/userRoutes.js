const { registerUser, authUser, sendSignature, allUsers } = require('../controllers/userControllers');
const { protect, validatePic } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/get-signature', sendSignature);
router.post('/', validatePic, registerUser);
router.get('/', protect, allUsers);
router.post('/login', authUser);

module.exports = router;