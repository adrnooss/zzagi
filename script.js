const story = {
    1: [
        { id: "text-1-1", text: "Hi Gizza ✨" },
        { id: "text-1-2", text: "There's something I've been meaning to tell you..." }
    ],
    2: [
        { id: "text-2-1", text: "It's crazy how we've been close for almost 2 months now." },
        { id: "text-2-2", text: "We've shared so much with each other, and honestly, I feel like we just really click." },
        { id: "text-2-3", text: "Every time we spend quality time together, I feel super comfortable around you." }
    ],
    3: [
        { id: "text-3-1", text: "Because of that..." },
        { id: "text-3-2", text: "I kinda want us to take this a bit deeper. Like, more than just friends." },
        { id: "text-3-3", text: "But hey, if you just want to keep things casual or be in a situationship, I'm genuinely okay with that too. I just really needed to get this off my chest." }
    ],
    4: [
        { id: "text-4-1", text: "So... do you wanna be my girlfriend?" }
    ],
    5: [
        { id: "text-5-1", text: "You just made my day! 🥰" },
        { id: "text-5-2", text: "Let's go on a proper date soon, yeah?" }
    ]
};

let isTyping = false;

// Efek Mengetik (Typewriter)
async function typeWriter(elementId, text, speed = 50) {
    const el = document.getElementById(elementId);
    el.innerHTML = "";
    el.style.display = "block";

    for (let i = 0; i < text.length; i++) {
        el.innerHTML += text.charAt(i);
        const randomDelay = speed + (Math.random() * 30 - 15);
        await new Promise(r => setTimeout(r, randomDelay));
    }
}

// Menjalankan teks per step
async function playStep(step) {
    isTyping = true;
    const lines = story[step];

    lines.forEach(line => {
        document.getElementById(line.id).innerHTML = "";
    });

    for (const line of lines) {
        await typeWriter(line.id, line.text, 50);
        await new Promise(r => setTimeout(r, 700));
    }

    const btn = document.getElementById(`btn-${step}`);
    if (btn) {
        btn.classList.remove('hidden-element');
        btn.classList.add('fade-in');
    }

    if (step === 5) {
        document.getElementById('icon-5').classList.remove('hidden-element');
        document.getElementById('icon-5').classList.add('fade-in');
        document.getElementById('btn-5').classList.remove('hidden-element');
        document.getElementById('btn-5').classList.add('fade-in');
        createConfetti();
    }
    isTyping = false;
}

// Transisi halaman
function nextStep(targetStep) {
    if (isTyping) return;

    const currentStep = targetStep - 1;
    const currentEl = document.getElementById(`step-${currentStep}`);
    const nextEl = document.getElementById(`step-${targetStep}`);

    if (currentEl) {
        currentEl.classList.remove('active');

        setTimeout(() => {
            currentEl.classList.add('hidden');
            if (nextEl) {
                nextEl.classList.remove('hidden');
                setTimeout(() => {
                    nextEl.classList.add('active');
                    playStep(targetStep);
                }, 50);
            }
        }, 1200);
    }
}

// Logika Tombol Nggak yang Menghindar (100% Anti Hilang)
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');

btnNo.addEventListener('mouseover', moveButton);
btnNo.addEventListener('touchstart', moveButton);

let isMoved = false;

function moveButton(e) {
    e.preventDefault();

    if (!isMoved) {
        // Ambil posisi awal tombol di layar
        const rect = btnNo.getBoundingClientRect();

        // Pindahkan elemen tombol ke layer paling luar (body) 
        // Ini MENCEGAH tombol menghilang karena bug CSS filter pada parent
        document.body.appendChild(btnNo);

        btnNo.style.position = 'fixed';
        btnNo.style.left = rect.left + 'px';
        btnNo.style.top = rect.top + 'px';
        btnNo.style.margin = '0';
        btnNo.style.zIndex = '9999';

        // Paksa browser merender ulang posisi fixed ini sebelum kita geser
        btnNo.getBoundingClientRect();

        isMoved = true;
    }

    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    const maxLeft = window.innerWidth - btnWidth - 20;
    const maxTop = window.innerHeight - btnHeight - 20;

    // Tentukan target acak yang DIJAMIN selalu di dalam layar
    const targetLeft = Math.max(20, Math.floor(Math.random() * maxLeft));
    const targetTop = Math.max(20, Math.floor(Math.random() * maxTop));

    // Hitung pergeseran dari titik origin (posisi left/top awal kita mengunci dia)
    const baseLeft = parseFloat(btnNo.style.left);
    const baseTop = parseFloat(btnNo.style.top);

    const translateX = targetLeft - baseLeft;
    const translateY = targetTop - baseTop;

    // Gerakan sangat lincah dan mantul
    btnNo.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    btnNo.style.transform = `translate(${translateX}px, ${translateY}px)`;

    // Tombol YES makin besar, tapi dibatasi agar tidak menutupi teks
    const transformStr = btnYes.style.transform || "";
    let currentScale = 1;
    if (transformStr.includes('scale')) {
        const match = transformStr.match(/scale\(([^)]+)\)/);
        if (match) currentScale = parseFloat(match[1]);
    }

    // Batas maksimal perbesaran diturunkan jadi 1.35x
    if (currentScale < 1.35) {
        btnYes.style.transform = `scale(${currentScale + 0.08})`;
    }
}

function accept() {
    // Sembunyikan tombol 'Gak dulu' karena posisinya sekarang ada di body luar
    if (btnNo) {
        btnNo.style.display = 'none';
    }
    
    // Panggil animasi kembang api bentuk cinta yang heboh!
    createHeartExplosion();
    
    nextStep(5);
}

// Ledakan Cinta Besar-besaran
function createHeartExplosion() {
    const container = document.getElementById('falling-hearts');
    const emojis = ['💖', '💕', '🥰', '✨', '💘', '🌸', '💍'];
    
    // Tiga gelombang ledakan cinta
    fireExplosion(container, emojis);
    setTimeout(() => fireExplosion(container, emojis), 400);
    setTimeout(() => fireExplosion(container, emojis), 800);
    setTimeout(() => fireExplosion(container, emojis), 1200);
}

function fireExplosion(container, emojis) {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-explosion');
            heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            
            // Mulai dari tengah layar
            heart.style.left = '50%';
            heart.style.top = '50%';
            
            // Arah ledakan acak (lingkaran penuh)
            const angle = Math.random() * Math.PI * 2;
            const velocity = 25 + Math.random() * 55; // Seberapa jauh terbangnya
            
            const tx = Math.cos(angle) * velocity + 'vw';
            const ty = Math.sin(angle) * velocity + 'vh';
            
            heart.style.setProperty('--tx', tx);
            heart.style.setProperty('--ty', ty);
            
            const duration = 1.5 + Math.random() * 2;
            heart.style.animation = `explode ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
            heart.style.fontSize = `${Math.random() * 30 + 20}px`;
            
            container.appendChild(heart);
            
            // Hapus elemen setelah selesai
            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }, Math.random() * 150); // Masing-masing keluar sedikit berurutan biar efeknya nyata
    }
}

// Partikel kelopak bunga sakura / hati jatuh
function createHearts() {
    const container = document.getElementById('falling-hearts');
    const symbols = ['🌸', '🤍', '✨'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left = Math.random() * 100 + 'vw';

        const duration = Math.random() * 13 + 12;
        const swayDuration = Math.random() * 3 + 2;

        heart.style.animationDuration = `${duration}s, ${swayDuration}s`;
        heart.style.fontSize = `${Math.random() * 12 + 10}px`;

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 800);
}

function createConfetti() {
    const container = document.getElementById('falling-hearts');
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const conf = document.createElement('div');
            conf.classList.add('heart');
            conf.innerText = '💖';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.animationDuration = `${Math.random() * 4 + 3}s, 2s`;
            conf.style.fontSize = `${Math.random() * 20 + 15}px`;
            container.appendChild(conf);
        }, i * 150);
    }
}

window.onload = () => {
    createHearts();
    setTimeout(() => {
        playStep(1);
    }, 500);
};
