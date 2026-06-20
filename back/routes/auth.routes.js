// routes/auth.routes.js
const express = require('express');
const router = express.Router();

router.get('/spotify/login', (req, res) => {
    console.log('Redirect URI envoyé (login):', process.env.SPOTIFY_REDIRECT_URI);

    const scope = 'playlist-read-private playlist-read-collaborative';
    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        scope
    });
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

router.get('/spotify/callback', async (req, res) => {
    console.log('Redirect URI envoyé (callback):', process.env.SPOTIFY_REDIRECT_URI);
    const { code } = req.query;
    const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        })
    });

    const data = await response.json();
    console.log('Réponse complète de Spotify :', data); // <-- ajoute ça

    res.send('Connecté ! Regarde la console pour le refresh_token.');
});

module.exports = router;