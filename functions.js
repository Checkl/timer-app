document.addEventListener("DOMContentLoaded", () => {
    keepActive();
    setVariableText();
    if (localStorage.getItem('timeMinutes') !== null) {
        timeMinutes = localStorage.getItem('timeMinutes');
        setVariableText();
    } else {
        timeMinutes = 12;
        setVariableText();
    }
    timer = timeMinutes * 60;
});
let timeMinutes;
let timerInterval;
let timer;
let isPaused = false;

function keepActive() {
    requestAnimationFrame(keepActive);
}

function openEditTime() {
    document.getElementById('lightbox').style.display = 'block';
}

function closeEditTime() {
    document.getElementById('lightbox').style.display = 'none';
}

function setNewTime() {
    newTime = document.getElementById('newTime').value;
    localStorage.setItem('timeMinutes', newTime);
    closeEditTime();
    resetTimer();
    location.reload();
}

function setVariableText() {
    document.querySelector('.title').innerText = timeMinutes + " Minute Timer";
    document.querySelector('#remainingTime').innerText = timeMinutes + ":00";
}

function setTitle(time) {
    if (time == 'stop') {
        document.title = "Timer stopped";
        return;
    } else if (time == 'pause') {
        document.title = "Timer paused";
        return;
    } else {
        document.title = time + " Timer running";
    }
}

function startTimer() {
    clearInterval(timerInterval);
    isPaused = false;
    playSound('sound_start');
    setTimeout(() => {
        timerInterval = setInterval(updateTimer, 1000);
    }, soundDuration('sound_start'));
    if (document.getElementById('playJingle').checked) {
        controlSpotify('pause');
        setTimeout(() => {
            playSound('sound_jingle');
        }, soundDuration('sound_start'));
        setTimeout(() => {
            controlSpotify('play');
        }, soundDuration('sound_jingle') + soundDuration('sound_start'));
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    setTitle('pause');
    isPaused = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timer = timeMinutes * 60 + 1;
    isPaused = false;
    stopSounds();
    updateTimer();
    controlSpotify('play');
    setTitle('stop');
}

function updateTimer() {
    if (!isPaused) {
        timer--;
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        let elapsedTime = timeMinutes * 60 - timer;
        let elapsedMinutes = Math.floor(elapsedTime / 60);
        let elapsedSeconds = elapsedTime % 60;
        document.getElementById('remainingTime').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.getElementById('elapsedTime').innerText = `${elapsedMinutes}:${elapsedSeconds < 10 ? '0' : ''}${elapsedSeconds}`;
        setTitle(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        if (timer === (timeMinutes / 2) * 60) {
            playSound('sound_halftime');
        }
        if (timer === 0) {
            clearInterval(timerInterval);
            playSound('sound_finish');
            setTimeout(() => {
                resetTimer();
            }, soundDuration('sound_finish'));
        }
    }
}

function playSound(audioId) {
    document.getElementById(audioId).play();
}

function soundDuration(audioId) {
    return document.getElementById(audioId).duration * 1000;
}

function stopSounds() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}
async function loadConfig() {
    const response = await fetch("credentials.json");
    const config = await response.json();
    return config;
}
let spotifyAccessToken = null;
async function getAccessToken() {
    if (spotifyAccessToken) return spotifyAccessToken;
    const config = await loadConfig();
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(config.client_id + ":" + config.client_secret)
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: config.refresh_token
        })
    });
    const data = await response.json();
    if (data.access_token) {
        spotifyAccessToken = data.access_token;
        setTimeout(() => spotifyAccessToken = null, 55 * 60 * 1000);
        return data.access_token;
    } else {
        console.error("Fehler beim Token-Refresh:", data);
        return null;
    }
}
async function controlSpotify(action) {
    const token = await getAccessToken();
    let controlSpotify = document.getElementById('controlSpotify').checked;
    if (!token) {
        console.error("Kein gültiges Access Token!");
        return;
    }
    if (action == 'pause' && controlSpotify) {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }
    if (action == 'play' && controlSpotify) {
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    } else {
        return;
    }
}