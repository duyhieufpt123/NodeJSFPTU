const express = require('express');
const bodyParser = require('body-parser');

const nationRouter = express.Router();
nationRouter.use(bodyParser.json());

const nations = [];

nationRouter.route('/')
    .get((req, res) => res.json(nations))
    .post((req, res) => {
        const newNation = req.body;
        if (!newNation || !newNation.name || !newNation.description)
            return res.status(400).json({ message: 'Bad request. Please provide valid data.' });
        newNation.id = nations.length + 1;
        nations.push(newNation);
        res.status(201).json({ message: 'Nation created successfully', nation: newNation });
    })
    .put((req, res) => res.status(403).end('PUT operation not supported on /nations'))
    .delete((req, res) => {
        nations.length = 0;
        res.json({ message: 'All nations deleted successfully' });
    });

nationRouter.route('/:nationId')
    .get((req, res) => {
        const nation = nations.find(n => n.id === parseInt(req.params.nationId));
        if (!nation) return res.status(404).json({ message: 'Nation not found' });
        res.json(nation);
    })
    .post((req, res) => res.status(403).end('POST operation not supported on /nations/:nationId'))
    .put((req, res) => {
        const updatedNation = req.body;
        const nationIndex = nations.findIndex(n => n.id === parseInt(req.params.nationId));
        if (nationIndex === -1 || !updatedNation)
            return res.status(404).json({ message: 'Nation not found or invalid data provided' });
        Object.assign(nations[nationIndex], updatedNation);
        res.json({ message: 'Nation updated successfully', nation: updatedNation });
    })
    .delete((req, res) => {
        const nationIndex = nations.findIndex(n => n.id === parseInt(req.params.nationId));
        if (nationIndex === -1) return res.status(404).json({ message: 'Nation not found' });
        nations.splice(nationIndex, 1);
        res.json({ message: 'Nation deleted successfully' });
    });

module.exports = nationRouter;
