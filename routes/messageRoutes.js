const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageControllers');

const router = require('express').Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, allMessages);

module.exports = router;