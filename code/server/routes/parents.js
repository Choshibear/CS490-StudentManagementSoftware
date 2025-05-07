const express = require('express');
const router = express.Router();
const {
    getAllParents,
    getParentById,
    getParentsByStudentId,
    getChildrenByParentId,
    addParent,
    updateParent,
    deleteParent
} = require('../db/parentQueries');

//Get all parents from the database
router.get('/', async (req, res) => {
    try {
        const parents = await getAllParents();
        res.json(parents);
    } catch (err) {
        console.error('Error fetching parents:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one parent by ID
router.get('/:id', async (req, res) => {
    try {
        const parent = await getParentById(req.params.id);
        if (!parent) return res.status(404).json({ error: 'Parent not found' });
        res.json(parent);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get all parents by student id
router.get('/parents/:studentId', async (req, res) => {
    try {
        const parents = await getParentsByStudentId(req.params.studentId);
        res.json(parents);
    } catch (err) {
        console.error('Error fetching parents for student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get all children by parent id
router.get('/children/:parentId', async (req, res) => {
    try {
        const children = await getChildrenByParentId(req.params.parentId);
        res.json(children);
    } catch (err) {
        console.error('Error fetching children for parent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new parent
router.post('/', async (req, res) => {
    try {
        await addParent(req.body);
        res.json({ message: 'Parent added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add Parent' });
    }
});

//Update an existing parent
router.put('/:id', async (req, res) => {
    try {
        await updateParent(req.params.id, req.body);
        res.json({ message: 'Parent updated' });
    } catch (err) {
        console.error('Error updating parent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Delete a parent
router.delete('/:id', async (req, res) => {
    try {
        await deleteParent(req.params.id);
        res.json({ message: 'Parent deleted' });
    } catch (err) {
        console.error('Error deleting parent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;