const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-song");
const currentProgress = document.getElementById("current-progress");

//indis
let index;

// tekrar
let loop;

//decode veya parse
const songsList = [
  {
    name: "Birden Geldin Aklıma",
    link: "/assets/Tuna Kiremitçi(Birden Geldin Aklıma).mp3",
    artist: "Tuna KİREMİTÇİ",
    image: "assets/TunaKiremitçi.jpg",
  },
  {
    name: "Araba",
    link: "/assets/sefo-araba.mp3",
    artist: "SEFO",
    image: "assets/sefo.jpg",
  },
  {
    name: "Diken mi Gül mü",
    link: "/assets/Diken mi.mp3",
    artist: "EYPİO",
    image: "assets/Eypio.jpg",
  },
  {
    name: "Geri Dönemedim",
    link: "/assets/Semicenk - Geri Dönemedim.mp3",
    artist: "SEMİCENK",
    image: "assets/semicenk.jpg",
  },
  {
    name: "Pişman Degilim",
    link: "assets/Semicenk feat. Doğu .mp3",
    artist: "Semicenk feat Doğu",
    image: "assets/semicenk feat Dogu.jpg",
  },
];

// OLAYLAR OBJESİ

let events = {
  mause: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (error) {
    deviceType = "mouse";
    return false;
  }
};

// zaman formatlama

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

const setSong = (arrayIndex) => {
  // console.log(arrayIndex)
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // sureyi göster

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  playAudio();
};

// sarkiyi oynat
const playAudio = () => {
  audio.play();
  playButton.classList.add("hide");
  pauseButton.classList.remove("hide");
};

// sarkı tekrarlama
repeatButton.addEventListener('click', () => {
  if (repeatButton.classList.contains('active')) {
      repeatButton.classList.remove('active')
      loop = false
  } else {
      repeatButton.classList.add('active')
      loop = true
  }
})

// sonraki şarkıya git

const nextSong = () => {
  // Eğer döngü modu açıksa
  if (loop) {
    let randIndex;
    do {
      randIndex = Math.floor(Math.random() * songsList.length);
    } while (randIndex === index); // Aynı şarkıyı seçmemek için kontrol
    index = randIndex;
  } else {
    if (index >= 0 && index < songsList.length - 1) {
      index++;
    } else {
      // Şu an çalan şarkı son şarkıysa, başa dön.
      index = 0;
    }
  }
  setSong(index);
  playAudio();
};








// sarkıyı durdur

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// önceki şarkı

const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

// siradakine geç

audio.onended = () => {
  nextSong();
};

// sarkıyı karıştır

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = false;
    console.log("Karıştır kapatıldı");
  } else {
    shuffleButton.classList.add("active");
    loop = true;
    console.log("Karıştırma açıldı");
  }
});

// play button
playButton.addEventListener("click", playAudio);

// next butto
nextButton.addEventListener("click", nextSong);

// pause button
pauseButton.addEventListener("click", pauseAudio);

// prev button
prevButton.addEventListener("click", previousSong);

isTouchDevice();
progressBar.addEventListener("click", (event) => {
  //progress bari baslat
  let coordStart = progressBar.getBoundingClientRect().left;

  //fare ile dokunma
  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  //genisligi ata
  currentProgress.style.width = progress * 100 + "%";

  //zamani ata
  audio.currentTime = progress * audio.duration;

  //oynat
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// zaman aktıkça güncelle

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

// zaman güncellemesi
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});
initPlaylist = () => {
  for (const i in songsList) {
    playlistSongs.innerHTML += ` <li class="playlistSong" 
    onclick="setSong(${i})">
    <div class="playlist-image-container">
       <img src="${songsList[i].image}"/>
    </div>
    
    <div class="playlist-song-details">
        <span id="playlist-song-name">
        ${songsList[i].name}
        </span>
        <span id="playlist-song-album"> 
        ${songsList[i].artist}
        </span>
    </div>
    </li>
    
    `;
  }
};

window.onload = () => {
  index = 0;
  setSong(index);
  initPlaylist();
};



// sarki Listesini göster

playlistButton.addEventListener("click", (e) => {
  playlistContainer.classList.remove("hide");
});

// sarkı listesini kapat

closeButton.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

playlistContainer.addEventListener('click',(e)=>{
  playlistContainer.classList.add('hide')
})
