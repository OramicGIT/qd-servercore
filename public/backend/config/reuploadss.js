const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// URLs of SFX converters
const converters = [
    "https://niko.gcs.icu",
    "https://lamb.gcs.icu",
    "https://omori.gcs.icu",
    "https://im.gcs.icu",
    "https://hat.gcs.icu",
    "https://converter.m336.dev",
    "https://cobalt.gcs.icu"
];

// Function to fetch songs from Newgrounds
async function fetchFromNewgrounds() {
    const apiUrl = 'https://www.newgrounds.io/api/v1/'; // Replace with actual Newgrounds API endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();
    for (const song of data.songs) {
        await downloadAndConvert(song.audio_url, song.title);
    }
}

// Function to fetch songs from NCS
async function fetchFromNCS() {
    const apiUrl = 'https://api.ncs.io/'; // Replace with actual NCS API endpoint or web scraping logic
    const response = await fetch(apiUrl);
    const data = await response.json();
    for (const song of data.songs) {
        await downloadAndConvert(song.audio_url, song.title);
    }
}

// Function to fetch songs from GD Song File Hub
async function fetchFromGDSongFileHub() {
    const apiUrl = 'https://gdsongfilehub.com/api_endpoint'; // Replace with actual GD Song File Hub API endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();
    for (const song of data.songs) {
        await downloadAndConvert(song.audio_url, song.title);
    }
}

// Function to fetch songs from Geometry Dash Server using random IDs
async function fetchFromGeometryDash() {
    const randomId = Math.floor(Math.random() * 1000000); // Generate a random song ID
    const apiUrl = `https://geometrydash.com/song.php?id=${randomId}`;
    const response = await fetch(apiUrl);
    const song = await response.json();
    await downloadAndConvert(song.audio_url, song.title);
}

// Function to apply SFX converters to downloaded audio
async function applySFXConverters(audioBuffer, filename) {
    for (const converter of converters) {
        const url = `${converter}/convert`;
        const response = await fetch(url, {
            method: 'POST',
            body: audioBuffer,
            headers: { 'Content-Type': 'audio/wav' } // Change if needed
        });
        const convertedBuffer = await response.buffer();
        fs.writeFileSync(path.join(__dirname, 'audio', `${filename}_converted.wav`), convertedBuffer);
    }
}

// Function to download and save audio files
async function downloadAndConvert(url, filename) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(path.join(__dirname, 'audio', filename), buffer);
    await applySFXConverters(buffer, filename);
}

// Main function to orchestrate fetching from all sources
async function fetchAllSongs() {
    await fetchFromNewgrounds();
    await fetchFromNCS();
    await fetchFromGDSongFileHub();
    await fetchFromGeometryDash();
}

// Run the main function
fetchAllSongs().then(() => {
    console.log('All songs fetched and converted successfully');
}).catch(err => {
    console.error('Error fetching songs:', err);
});
