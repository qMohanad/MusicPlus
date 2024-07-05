const body = document.querySelector('body');

const disk = document.querySelector('.disk');
const disk_img = document.querySelector('.disk img');

const playButton = document.querySelector('#play');
const modeButton = document.querySelector('#mode');

const hoverTime = document.querySelector('.hover-time');
const hoverTimeText = document.querySelector('.hover-time span');
const progress = document.querySelector('.progress-bar');
const progressDot = document.querySelector('.progress-dot');
const progressArea = document.querySelector('.progress-area');
const page_title = document.querySelector('#title');
const song_source = document.querySelector('#song-audio');
const song_name = document.querySelector('#song-name');
const song_artist = document.querySelector('#song-artist');
const menu_card = document.querySelector('.menu-card');
const songs_list = document.querySelector('.songs-list');
const lyrics_list = document.querySelector('.lyrics-list');

const song_maxTime = document.querySelector('#max-time');
const song_currentTime = document.querySelector('#current-time');

const container = document.querySelector('.container');

let currentRotation = 0;
let value = 1;
let SongsData = [];
let LyricsData = [];
let currentSongIndex = 1;
let songsCount = 0;

let isMusicPlaying = false;
let isRepeatMode = false;

let isDotHoveredBool = false;

function nextSong() {
    //disk.style.animation="RotateDiskRight 0.9s ease 1";
    currentRotation += 360;
    disk.style.rotate = `${currentRotation}deg`;
    if (songsCount > currentSongIndex) {
        ++currentSongIndex;
    } else {
        currentSongIndex = 1;
    }
    sendSongsData();
    song_source.play();
} function prevSong() {
    //disk.style.animation="RotateDiskLeft 0.9s ease 1";
    currentRotation -= 360;
    disk.style.rotate = `${currentRotation}deg`;
    if (currentSongIndex > 1) {
        --currentSongIndex;
    } else {
        currentSongIndex = songsCount;
    }
    sendSongsData();
    song_source.play();
}


function togglePlaySong() {
    isMusicPlaying ? song_source.pause() : song_source.play();
    isMusicPlaying = !isMusicPlaying;
    console.log(isMusicPlaying);
    progress.classList.toggle('play');
}

function setPauseButton() {
    playButton.innerHTML = `
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"/>
    </svg>
    `
}
function setPlayButton() {
    playButton.innerHTML = `
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clip-rule="evenodd"/>
    </svg>
    `
}



function sendSongsData() {
    page_title.textContent = `Music | ${SongsData[currentSongIndex - 1].name} • ${SongsData[currentSongIndex - 1].artist}`
    song_name.textContent = `${currentSongIndex}. ${SongsData[currentSongIndex - 1].name}`;
    song_artist.textContent = `${SongsData[currentSongIndex - 1].artist}`;
    disk_img.setAttribute('src', SongsData[currentSongIndex - 1].img);
    song_source.setAttribute('src', SongsData[currentSongIndex - 1].source);
    addLyrics(SongsData[currentSongIndex - 1].name);
    /*
    for (let song = 1; song < songsCount; song++) {
        if (song != currentSongIndex) {
            let songHTML = document.querySelector(`#song-${song}`);
            if (songHTML.classList.contains('playing')) {
                songHTML.classList.remove('playing');
            }
        } else {
            let songHTML = document.querySelector(`#song-${currentSongIndex}`);
            songHTML.classList.add('playing');
        }
    }*/
}

const getSongsData = () => {
    fetch("songs.json")
        .then(data => data.json())
        .then(songs => {
            SongsData = songs;
            SongsData.forEach(data => {
                ++songsCount;
            });
            //arrangeSongsList();
            sendSongsData();
            console.log(songsCount);
        });
}; getSongsData();


song_source.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const maximumTime = e.target.duration;
    progress.style.width = `${(currentTime / maximumTime) * 100}%`;
    disk.style.rotate = `${(currentTime / maximumTime) * 2000}deg`;
    currentRotation = (currentTime / maximumTime) * 2000;
    let maximum_mins = Math.floor(maximumTime / 60);
    let maximum_secs = Math.floor(maximumTime % 60);
    if (maximum_secs < 10) {
        maximum_secs = `0${maximum_secs}`;
    }
    if (song_maxTime.textContent != `${maximum_mins}:${maximum_secs}`){

        if (`${maximum_mins}:${maximum_secs}` == 'NaN:NaN'){
            song_maxTime.textContent = `0:00`;
        }else {
            song_maxTime.textContent = `${maximum_mins}:${maximum_secs}`;
        }
    }
    
    let current_mins = Math.floor(currentTime / 60);
    let current_secs = Math.floor(currentTime % 60);
    if (current_secs < 10) {
        current_secs = `0${current_secs}`;
    }
    song_currentTime.textContent = `${current_mins}:${current_secs}`;
    

    if (currentTime == maximumTime) { // Track ended
        if (isRepeatMode) {
            e.target.currentTime = 0;
            isMusicPlaying = false;
            togglePlaySong();
        } else {
            e.target.currentTime = 0;
            nextSong();
        }
    }
})

function changeMode() {
    isRepeatMode = !isRepeatMode;
    if (isRepeatMode) {
        modeButton.innerHTML =
            `
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 4 3 3H5v3m3 10-3-3h14v-3m-9-2.5 2-1.5v4"/>
        </svg>
        `
    } else {
        modeButton.innerHTML = `
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
        </svg>
        `
    }
    console.log(isRepeatMode);
}


function toggleDarkMode(){
    body.classList.toggle('dark');
}
function showSongsList() {
    menu_card.classList.toggle('show');
    container.classList.toggle('showSongsList');
}
function arrangeSongsList() {
    let index = 1;
    songs_list.innerHTML = '';
    SongsData.forEach(song => {
        let songDiv = document.createElement('div');
        songDiv.classList.add('song');
        songDiv.id = `song-${index}`;
        songDiv.innerHTML =
            `
        <img src="${song.img}" alt="">
        <div class="data">
            <div class="name">
                ${song.name}
            </div>
            <div class="artist">
                ${song.artist}
            </div>
        </div>
        `
        songs_list.appendChild(songDiv);
        ++index;
    })
}

progressArea.addEventListener('click', (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickPosition = e.offsetX;
    let musicDuration = song_source.duration;
    if (!isDotHoveredBool){
        song_source.currentTime = (clickPosition / progressWidth) * musicDuration;
    }
});


progressArea.addEventListener('mousemove', (e) => {
    if (!isDotHoveredBool){
        let progressWidth = progressArea.clientWidth;
        let clickPosition = e.offsetX;
        let musicDuration = song_source.duration;
        hoverTime.style.marginLeft = `${(clickPosition / progressWidth) * 17.5}%`;
        
        let time = (clickPosition / progressWidth) * musicDuration;
        let current_mins = Math.floor(time / 60);
        let current_secs = Math.floor(time % 60);
        if (current_secs < 10) {
            current_secs = `0${current_secs}`;
        }
        hoverTimeText.textContent = `${current_mins}:${current_secs}`;
        
    }
});

function addLyrics(lyrics_fileName){
    fetch(`songs-lyrics/${lyrics_fileName}.json`)
    .then(res => res.json())
    .then(lyrics_file => {
        LyricsData = lyrics_file.lyrics;
        console.log(LyricsData);
        if(LyricsData != undefined){let index = 1;
            lyrics_list.innerHTML = '';
            LyricsData.forEach(line => {
                let lyrics_line = document.createElement('div');
                lyrics_line.classList.add('line');
                lyrics_line.textContent = `${line}`
                lyrics_list.appendChild(lyrics_line);
                ++index;
            })
        }
    });
}
