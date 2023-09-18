const express = require('express');
const bodyParser = require('body-parser');

const playerRouter = express.Router();
playerRouter.use(bodyParser.json());


const players = [];

playerRouter.route('/')
    .get((req, res) => res.json(players))
    .post((req, res) => {
        const newPlayer = req.body;
        if (!newPlayer || !newPlayer.name || !newPlayer.nation)
            return res.status(400).json({ message: 'Bad request. Please provide valid data.' });
            newPlayer.id = players.length + 1;
            players.push(newPlayer);
        res.status(201).json({ message: 'Nation created successfully', player: newPlayer });
    })
    .put((req, res) => res.status(403).end('PUT operation not supported on /players'))

playerRouter.route('/:playerId')
    .get((req, res) => {
        const player = players.find(p => p.id === parseInt(req.params.playerId));
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    })
    .post((req, res) => res.status(403).end('POST operation not supported on /players/:playerId'))
    .put((req, res) => {
        const updatedPlayer = req.body;
        const playerIndex = players.findIndex(p => p.id === parseInt(req.params.playerId));
        if (playerIndex === -1 || !updatedPlayer)
            return res.status(404).json({ message: 'Player not found or invalid data provided' });
        Object.assign(players[playerIndex], updatedPlayer);
        res.json({ message: 'Player updated successfully', player: updatedPlayer });
    })
    .delete((req, res) => {
        const playerIndex = players.findIndex(p => p.id === parseInt(req.params.playerId));
        if (playerIndex === -1) return res.status(404).json({ message: 'Player not found' });
        players.splice(playerIndex, 1);
        res.json({ message: 'player deleted successfully' });
    });

module.exports = playerRouter;
