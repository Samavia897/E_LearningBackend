const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Define routes for Contact messages

// POST /api/contact
// Create a new contact message
router.post('/', contactController.submitMessage);

// GET /api/contact
// Get all contact messages
router.get('/', contactController.getAllMessages);

// GET /api/contact/:id
// Get a single contact message by its ID
router.get('/:id', contactController.getMessageById);

// PUT /api/contact/:id
// Update a contact message by its ID
router.put('/:id', contactController.updateMessage);

// DELETE /api/contact/:id
// Delete a contact message by its ID
router.delete('/:id', contactController.deleteMessage);

module.exports = router;