const firebaseConfig = {
    apiKey: "AIzaSyBi9zuGjblDXhXpKLAqf9nTj_Ki-fOar2I",
    authDomain: "o-arquivista-69d2b.firebaseapp.com",
    projectId: "o-arquivista-69d2b",
    storageBucket: "o-arquivista-69d2b.firebasestorage.app",
    messagingSenderId: "659470982011",
    appId: "1:659470982011:web:36619b8666f20cb82cfbde",
    measurementId: "G-BL9BENVQJC"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let topScores = [];

// --- MÚSICA DE FUNDO DA FASE ---
const bgMusic = new Audio('assets/sounds/fase.mp3');
bgMusic.loop = true;

function fetchRecordes() {
    db.collection("recordes").orderBy("pontuacao", "desc").limit(5).get()
    .then((querySnapshot) => {
        topScores = [];
        querySnapshot.forEach((doc) => topScores.push(doc.data()));
    })
    .catch(err => console.log("Sem conexão aos recordes ainda..."));
}
fetchRecordes(); 

function salvarProgresso() {
    let playerName = localStorage.getItem("arquivista_nome") || "Anônimo";
    
    db.collection("recordes").doc(playerName).get().then((docSnapshot) => {
        let melhorPontuacao = score;
        let melhorFase = currentLevel;
        
        if (docSnapshot.exists) {
            let dados = docSnapshot.data();
            if (dados.pontuacao > score) melhorPontuacao = dados.pontuacao;
            if (dados.fase_alcancada > currentLevel) melhorFase = dados.fase_alcancada;
        }

        db.collection("recordes").doc(playerName).set({
            nome: playerName,
            fase_alcancada: melhorFase,
            pontuacao: melhorPontuacao,
            ultima_partida: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => fetchRecordes());
    });
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleElement = document.getElementById('game-title');

const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

const assets = { 
    bg: new Image(), arm: new Image(), doc: new Image(),
    flavio: new Image(), rosale: new Image(), eliezer: new Image(), igorgak: new Image()
};
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';
assets.flavio.src = 'assets/sprites/flavio.png';
assets.rosale.src = 'assets/sprites/rosale.png';
assets.eliezer.src = 'assets/sprites/eliezer.png';
assets.igorgak.src = 'assets/sprites/igorgak.png';

let player, cameraX, score, health, timer, timerAccumulator, gameState;
let currentLevel = 1;
const MAX_LEVELS = 10;
let levelData = {}; 

let keys = { left: false, right: false
