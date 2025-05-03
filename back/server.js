// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Remplacez par l'origine autorisée
        methods: ["GET", "POST"], // Méthodes HTTP autorisées
    },
});

let rooms = []

io.on('connection', (socket) => {
    console.log('[Nouvelle connexion] :', socket.id);

    socket.on('playerData', (player) => {
        console.log('[Nom du joueur] :', player.username);
        let room = null;

        if(!player.roomId){
            room = createRoom(player);
            console.log('[Room créer] :' + room.id + ' avec le joueur ' + player.username);
            socket.emit('roomCreated', {roomId: room.id});

        }
        else {
            room = rooms.find(r => r.id === player.roomId);

            if (room === undefined){
                return
            }

            room.players.push(player);
        }

        socket.join(room.id);
        io.to(socket.id).emit('join room', room.id);

    })

    socket.on('get rooms', () => {
        io.to(socket.id).emit('list rooms', rooms);
    })

    socket.on('disconnect', () => {
        console.log('[Déconnexion] :', socket.id);
        let room = null;

        rooms.forEach(r => {
          r.players.forEach((p) => {
              if (p.socketId === socket.id && p.host) {
                  room = r;
                  rooms = rooms.filter(r => r !== room);
              }
          })
        })
    })
})


function createRoom(player){
    const room = {
        id : generateRoomId(),
        players: [],
    }

    player.roomId = room.id;
    room.players.push(player);
    rooms.push(room);

    return room;
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 9);
}















app.get('/api/deezer/get-categories', async (req, res) => {
    const deezerUrl = 'https://api.deezer.com/chart'; // URL de l'API Deezer passée en paramètre

    if (!deezerUrl) {
        return res.status(400).json({ error: 'La requête doit inclure un paramètre "q" avec l\'URL de l\'API Deezer.' });
    }

    try {
        const response = await fetch(deezerUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors de l'appel à Deezer: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Deezer:', error);
        res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Deezer' });
    }
});


app.post('/api/deezer/start-blindtest', async (req, res) => {
    const trackListUrl = req.body.trackListUrl; // URL de la liste de pistes à jouer

    if (!trackListUrl) {
        return res.status(400).json({ error: 'La requête doit inclure un paramètre "trackListUrl" avec l\'URL de la liste de pistes.' });
    }

    try {
        const response = await fetch(trackListUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors de l'appel à Deezer: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Deezer:', error);
        res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Deezer' });
    }
});

httpServer.listen(3001);