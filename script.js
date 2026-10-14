document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});
const page = document.body.dataset.page;
if (page === 'home') {
    const particleBox = document.createElement('div');
    particleBox.className = 'particle-box';
    document.body.appendChild(particleBox);
    function spawnParticle(x, y, dx = 0, dy = 0) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = 6 + Math.random() * 10;
        p.style.width  = size + 'px';
        p.style.height = size + 'px';
        p.style.left   = x + 'px';
        p.style.top    = y + 'px';
        p.style.setProperty('--dx', dx + 'px');
        p.style.setProperty('--dy', dy + 'px');
        const hue = 180 + Math.random() * 100;
        p.style.background =
            `radial-gradient(circle, hsl(${hue}, 100%, 70%) 0%, hsla(${hue}, 100%, 70%, 0) 70%)`;

        particleBox.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 35) return; // не чаще 1 раза в 35 мс
        lastTime = now;

        const dx = (Math.random() - 0.5) * 60;
        const dy = (Math.random() - 0.5) * 60;
        spawnParticle(e.clientX, e.clientY, dx, dy);
    });
    const title = document.getElementById('hero-title');
    const colors = ['#00e5ff', '#ff2d95', '#ffd400', '#7cff4f', '#b06bff'];
    let colorIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;

        colorIndex = (colorIndex + 1) % colors.length;
        title.style.color = colors[colorIndex];
        title.classList.remove('pop');
        void title.offsetWidth; 
        title.classList.add('pop');
    });
    const btn = document.getElementById('startBtn');
    btn.addEventListener('click', () => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const dist  = 100 + Math.random() * 400;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist;
                spawnParticle(cx, cy, dx, dy);
            }, i * 12);
        }

        btn.textContent = 'Поехали';
    });
}
if (page === 'games') {

    const cards = document.querySelectorAll('.card');
    let activeIndex = 0;
    function setActive(index) {
        cards.forEach(c => c.classList.remove('active'));
        cards[index].classList.add('active');
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setActive(0);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % cards.length;
            setActive(activeIndex);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + cards.length) % cards.length;
            setActive(activeIndex);
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            launchCard(cards[activeIndex]);
        }
    });
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            activeIndex = i;
            setActive(i);
            launchCard(card);
        });
        card.addEventListener('mouseenter', () => {
            activeIndex = i;
            setActive(i);
        });
    });
    function launchCard(card) {
        card.classList.remove('launch');
        void card.offsetWidth;
        card.classList.add('launch');

        const name = card.querySelector('h3').textContent;
        showToast('Запуск: ' + name);
    }
    function showToast(text) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed; left: 50%; bottom: 40px;
                transform: translateX(-50%) translateY(80px);
                padding: 12px 26px; border-radius: 30px;
                background: linear-gradient(90deg, #ff2d95, #7c4dff);
                color: #fff; font-size: 15px;
                box-shadow: 0 10px 30px rgba(255,45,149,0.5);
                transition: transform 0.4s;
                z-index: 100;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(80px)';
        }, 1500);
    }
}
if (page === 'contact') {

    const form       = document.getElementById('contactForm');
    const nameInput  = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const msgInput   = document.getElementById('message');
    const formMsg    = document.getElementById('formMsg');
    const circles = [];
    const circleColors = ['#ff2d95', '#7c4dff', '#00e5ff'];
    for (let i = 0; i < 3; i++) {
        const c = document.createElement('div');
        c.className = 'bg-circle';
        const size = 200 + Math.random() * 200;
        c.style.width  = size + 'px';
        c.style.height = size + 'px';
        c.style.left   = Math.random() * 80 + '%';
        c.style.top    = Math.random() * 80 + '%';
        c.style.background = circleColors[i];
        document.body.appendChild(c);
        circles.push({ el: c, speed: 0.02 + i * 0.02 });
    }
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX - window.innerWidth  / 2;
        const y = e.clientY - window.innerHeight / 2;

        circles.forEach(c => {
            c.el.style.transform =
                `translate(${-x * c.speed}px, ${-y * c.speed}px)`;
        });
    });
    function setError(input, hasError) {
        input.parentElement.classList.toggle('error', hasError);
    }
    function isValidEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function validate() {
        let ok = true;

        if (nameInput.value.trim().length < 2) {
            setError(nameInput, true); ok = false;
        } else setError(nameInput, false);

        if (!isValidEmail(emailInput.value.trim())) {
            setError(emailInput, true); ok = false;
        } else setError(emailInput, false);

        if (msgInput.value.trim().length < 5) {
            setError(msgInput, true); ok = false;
        } else setError(msgInput, false);

        return ok;
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validate()) {
            formMsg.textContent = 'Спасибо! Сообщение отправлено.';
            formMsg.className = 'form-msg ok';
            form.reset();
        } else {
            formMsg.textContent = 'Проверь поля формы.';
            formMsg.className = 'form-msg bad';
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            form.requestSubmit(); 
        }
    });
    [nameInput, emailInput, msgInput].forEach(inp => {
        inp.addEventListener('input', () => setError(inp, false));
    });
}