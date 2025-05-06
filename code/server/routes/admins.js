const express = require('express');
const router = express.Router();
const {
    getAllAdmins,
    getAdminById,
    addAdmin,
    updateAdminById,
    deleteAdminById
} = require('../db/adminQueries');

//Get all admins from the database
router.get('/', async (req, res) => {
    try {
        const admins = await getAllAdmins();
        res.json(admins);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one admin by ID
router.get('/:id', async (req, res) => {
    try {
        const admin = await getAdminById(req.params.id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new admin
router.post('/', async (req, res) => {
    try {
        await addAdmin(req.body);
        res.json({ message: 'Admin added' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add Admin' });
    }
});

//Update an existing admin
router.put('/:id', async (req, res) => {
    try {
        await updateAdminById(req.params.id, req.body);
        res.json({ message: 'Admin updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update Admin' });
    }
});

//Delete an existing admin
router.delete('/:id', async (req, res) => {
    try {
        await deleteAdminById(req.params.id);
        res.json({ message: 'Admin deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete Admin' });
    }
});

module.exports = router;