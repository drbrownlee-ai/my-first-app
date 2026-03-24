document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');

    // Pages implementation
    const pages = {
        home: renderHome,
        post: renderPost,
        insights: renderInsights
    };

    // State
    let currentPage = 'home';

    // Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (page === currentPage) return;

            // Update active state
            navItems.forEach(n => n.classList.remove('active'));
            if(!e.currentTarget.classList.contains('create-btn')) {
                e.currentTarget.classList.add('active');
            }

            // Render page content
            currentPage = page;
            renderPage(page);
        });
    });

    function renderPage(pageId) {
        mainContent.innerHTML = '';
        const pageRenderer = pages[pageId];
        if (pageRenderer) {
            const content = pageRenderer();
            content.classList.add('fade-in');
            mainContent.appendChild(content);
        }
    }

    // --- Page Renderers ---

    const MOCK_CARDS = [
        { id: 1, text: "Lost in the neon lights tonight...", color: "var(--vibe-dreamy)", user: "@stardust_99", emoji: "🌌" },
        { id: 2, text: "Let's burn this city. Too much energy.", color: "var(--vibe-energetic)", user: "@fire_walker", emoji: "🔥" },
        { id: 3, text: "Midnight rain and coffee. Peaceful.", color: "var(--vibe-calm)", user: "@blue_moon", emoji: "☕" },
        { id: 4, text: "Feeling kinda empty but it's okay.", color: "var(--vibe-melancholy)", user: "@quiet_soul", emoji: "🌧️" }
    ];

    function renderHome() {
        const container = document.createElement('div');
        container.className = 'page-container';
        container.style.height = '100%';
        container.style.position = 'relative';

        const header = document.createElement('div');
        header.className = 'home-header';
        header.innerHTML = `<h2>Discovery</h2><span class="material-icons-outlined header-icon">tune</span>`;
        container.appendChild(header);

        const cardStack = document.createElement('div');
        cardStack.className = 'card-stack';

        // Render cards from back to front
        [...MOCK_CARDS].reverse().forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'vibe-card';
            cardEl.style.background = card.color;
            if (index === MOCK_CARDS.length - 1) cardEl.classList.add('active-card');
            
            cardEl.innerHTML = `
                <div class="card-content">
                    <div class="card-emoji">${card.emoji}</div>
                    <p class="card-text">"${card.text}"</p>
                    <div class="card-user">${card.user}</div>
                </div>
                <div class="reaction-zone">
                    <div class="reaction-btn"><span class="material-icons-outlined">favorite_border</span></div>
                    <div class="reaction-btn vibe-sync"><span class="material-icons-outlined">all_inclusive</span> Sync</div>
                </div>
            `;
            
            // Simple swipe logic (just click to pop for now)
            cardEl.addEventListener('click', (e) => {
                if (e.target.closest('.reaction-btn')) {
                    // Reaction effect
                    const btn = e.target.closest('.reaction-btn');
                    btn.classList.add('ping-effect');
                    if (navigator.vibrate) navigator.vibrate(50); // Haptic
                    setTimeout(() => btn.classList.remove('ping-effect'), 500);
                    return;
                }

                if (cardEl.classList.contains('active-card')) {
                    cardEl.style.transform = 'translateX(-150%) rotate(-20deg)';
                    cardEl.style.opacity = '0';
                    setTimeout(() => {
                        cardEl.remove();
                        const remaining = cardStack.querySelectorAll('.vibe-card');
                        if (remaining.length > 0) {
                            remaining[remaining.length - 1].classList.add('active-card');
                        } else {
                            cardStack.innerHTML = '<div style="margin:auto; text-align:center; color:var(--text-secondary)">No more vibes</div>';
                        }
                    }, 300);
                }
            });

            cardStack.appendChild(cardEl);
        });

        container.appendChild(cardStack);
        return container;
    }

    function renderPost() {
        const container = document.createElement('div');
        container.className = 'page-container';
        container.style.height = '100%';

        const header = document.createElement('div');
        header.className = 'home-header';
        header.innerHTML = `<h2>Record Vibe</h2><span class="material-icons-outlined header-icon">close</span>`;
        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'post-container';

        // Mocks for options
        const colors = [
            { id: 'dreamy', val: 'var(--vibe-dreamy)' },
            { id: 'energetic', val: 'var(--vibe-energetic)' },
            { id: 'calm', val: 'var(--vibe-calm)' },
            { id: 'melancholy', val: 'var(--vibe-melancholy)' }
        ];
        const emojis = ['🌌', '🔥', '☕', '🌧️', '✨', '🎵', '😴', '👽'];

        let selectedColor = colors[0].val;
        let selectedEmoji = emojis[0];

        content.innerHTML = `
            <div class="mood-preview" style="background: ${selectedColor}">
                <div class="preview-emoji">${selectedEmoji}</div>
                <input type="text" class="preview-input" placeholder="How are you feeling?" maxlength="50" />
            </div>

            <div class="mood-picker">
                <h3>Select Color</h3>
                <div class="picker-row">
                    ${colors.map((c, i) => `<div class="color-circ ${i===0 ? 'active' : ''}" style="background: ${c.val}" data-color="${c.val}"></div>`).join('')}
                </div>
                
                <h3 style="margin-top: 20px;">Select Emoji</h3>
                <div class="picker-row emoji-row">
                    ${emojis.map((e, i) => `<div class="emoji-circ ${i===0 ? 'active' : ''}" data-emoji="${e}">${e}</div>`).join('')}
                </div>
                
                <button class="post-btn">Share Vibe <span class="material-icons-outlined" style="font-size:18px;">send</span></button>
            </div>
        `;

        // Event listeners
        const previewEl = content.querySelector('.mood-preview');
        const previewEmoji = content.querySelector('.preview-emoji');

        content.querySelectorAll('.color-circ').forEach(el => {
            el.addEventListener('click', (e) => {
                content.querySelectorAll('.color-circ').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                selectedColor = e.target.dataset.color;
                previewEl.style.background = selectedColor;
                if (navigator.vibrate) navigator.vibrate(20);
            });
        });

        content.querySelectorAll('.emoji-circ').forEach(el => {
            el.addEventListener('click', (e) => {
                content.querySelectorAll('.emoji-circ').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                selectedEmoji = e.target.dataset.emoji;
                previewEmoji.textContent = selectedEmoji;
                previewEmoji.style.animation = 'none';
                void previewEmoji.offsetWidth; // trigger reflow
                previewEmoji.style.animation = 'pingAnim 0.3s ease';
                if (navigator.vibrate) navigator.vibrate(20);
            });
        });

        const postBtn = content.querySelector('.post-btn');
        postBtn.addEventListener('click', () => {
            const inputVal = content.querySelector('.preview-input').value;
            if (!inputVal.trim()) return alert("Please enter your feeling.");
            postBtn.innerHTML = 'Sharing...';
            setTimeout(() => {
                // Add to mock cards
                MOCK_CARDS.push({
                    id: Date.now(),
                    text: inputVal,
                    color: selectedColor,
                    user: "@me",
                    emoji: selectedEmoji
                });
                // Go back to home
                document.querySelector('.nav-item[data-page="home"]').click();
            }, 800);
        });

        container.appendChild(content);
        return container;
    }

    function renderInsights() {
        const container = document.createElement('div');
        container.className = 'page-container';
        container.style.height = '100%';

        const header = document.createElement('div');
        header.className = 'home-header';
        header.innerHTML = `<h2>My Vibe</h2><span class="material-icons-outlined header-icon">settings</span>`;
        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'insights-container';
        
        // Mock Month Data
        const daysInMonth = 30;
        const recordedDays = [1, 3, 4, 5, 8, 9, 12, 14, 15, 18, 20, 21, 24, 25, 27, 28];
        const colors = ['var(--vibe-calm)', 'var(--vibe-dreamy)', 'var(--vibe-energetic)', 'var(--vibe-melancholy)'];
        
        let gridHtml = '';
        for (let i = 1; i <= daysInMonth; i++) {
            if (recordedDays.includes(i)) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                gridHtml += `<div class="day-chip active" style="background: ${color};"><span class="day-num">${i}</span></div>`;
            } else {
                gridHtml += `<div class="day-chip"><span class="day-num">${i}</span></div>`;
            }
        }

        content.innerHTML = `
            <div class="stats-card">
                <div class="user-profile">
                    <div class="profile-pic">@m</div>
                    <div>
                        <h3 style="font-size: 1.2rem;">@me</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Current Vibe: Dreamy ✨</p>
                    </div>
                </div>
                
                <div class="stats-row">
                    <div class="stat-item">
                        <span class="stat-val">16</span>
                        <span class="stat-label">Vibes Boxed</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-val">Dreamy</span>
                        <span class="stat-label">Top Mood</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-val">48</span>
                        <span class="stat-label">Syncs</span>
                    </div>
                </div>
            </div>

            <div class="calendar-section">
                <div class="calendar-header">
                    <h3>October Vibes</h3>
                    <span class="material-icons-outlined">calendar_month</span>
                </div>
                <div class="calendar-grid">
                    ${gridHtml}
                </div>
            </div>
            
            <button class="export-btn">
                <span class="material-icons-outlined">ios_share</span> Export to Instagram
            </button>
        `;

        // Export animation
        const exportBtn = content.querySelector('.export-btn');
        exportBtn.addEventListener('click', () => {
            exportBtn.innerHTML = '<span class="material-icons-outlined">check_circle</span> Exported!';
            exportBtn.style.background = '#2ebd59';
            setTimeout(() => {
                exportBtn.innerHTML = '<span class="material-icons-outlined">ios_share</span> Export to Instagram';
                exportBtn.style.background = 'var(--surface-color)';
            }, 2000);
        });

        container.appendChild(content);
        return container;
    }

    // Initial load
    setTimeout(() => {
        renderPage('home');
    }, 1500); // Fake loading screen
});
