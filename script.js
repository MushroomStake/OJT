document.addEventListener('DOMContentLoaded', function() {
    function revealOnScroll(selector) {
        const elements = document.querySelectorAll(selector);
        const reveal = () => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 60) {
                    el.classList.add('fade-in');
                }
            });
        };
        window.addEventListener('scroll', reveal);
        reveal();
    }
    revealOnScroll('.hero');
    revealOnScroll('.vlog-section');
    revealOnScroll('.projects');

    // Modal logic with image carousel
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);

    // Images for each week (customize as needed)
    const weekImages = {
        'Week 1': ['assets/Day1-1.jfif', 'assets/Day1-2.jfif', 'assets/Day1-3.jfif', 'assets/Day1-4.jfif', 'assets/Day1-5.jfif'],
        'Week 2': ['assets/Day2-1.jfif', 'assets/Day2-2.jfif'],
        'Week 3': ['assets/Day3-1.jfif', 'assets/Day3-2.jfif', 'assets/Day3-3.jfif', 'assets/Day3-4.jfif'],
        'Week 4': ['assets/Day5-1.jfif', 'assets/Day5-2.jfif', ],
        'Week 5': ['assets/Day7-2.jfif', 'assets/Day7-2.jfif'],
        'Week 6': ['assets/Day8-1.jfif', 'assets/Day8-2.jfif', 'assets/Day8-3.jfif', 'assets/Day8-4.jfif', 'assets/Day8-5.jfif', 'assets/Day8-6.jfif']
    };

    // Automatic slideshow for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        const weekTitle = card.querySelector('h3').textContent;
        const images = weekImages[weekTitle] || [card.querySelector('img').getAttribute('src')];
        const slideshow = document.createElement('div');
        slideshow.className = 'slideshow';
        images.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = weekTitle;
            img.className = 'slideshow-img' + (idx === 0 ? ' active' : '');
            slideshow.appendChild(img);
        });
        const oldImg = card.querySelector('img');
        oldImg.style.display = 'none';
        card.insertBefore(slideshow, oldImg);
        let current = 0;
        setInterval(() => {
            const imgs = slideshow.querySelectorAll('.slideshow-img');
            imgs.forEach((img, idx) => img.classList.remove('active'));
            current = (current + 1) % imgs.length;
            imgs[current].classList.add('active');
        }, 4000);

        // Truncate description if too long (automatic)
        const desc = card.querySelector('.project-info p');
        const fullText = desc.textContent;
        const limit = 110;
        if (fullText.length > limit) {
            desc.textContent = fullText.slice(0, limit).trim() + '...';
            desc.setAttribute('data-full', fullText);
        }
    });

    // Modal logic (unchanged)
    function showModal(imgSrc, weekTitle, weekDesc) {
        // Use full description from card if available
        const card = Array.from(document.querySelectorAll('.project-card')).find(c => c.querySelector('h3').textContent === weekTitle);
        let fullDesc = weekDesc;
        if (card) {
            const descElem = card.querySelector('.project-info p');
            if (descElem && descElem.hasAttribute('data-full')) {
                fullDesc = descElem.getAttribute('data-full');
            }
        }
        const images = weekImages[weekTitle] || [imgSrc];
        let current = 0;
        let intervalId;
        function render() {
            modalOverlay.innerHTML = `
                <button class="modal-close" title="Close">&times;</button>
                <div class="modal-container">
                    <div class="modal-image">
                        <div class="carousel">
                            <img src="${images[current]}" alt="${weekTitle}" class="carousel-img fade-in-img" />
                        </div>
                    </div>
                    <div class="modal-details">
                        <h3>${weekTitle}</h3>
                        <p>${fullDesc}</p>
                    </div>
                </div>
            `;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            modalOverlay.querySelector('.modal-close').onclick = closeModal;
            modalOverlay.onclick = function(e) {
                if (e.target === modalOverlay) closeModal();
            };
        }
        function fadeToImage() {
            const img = modalOverlay.querySelector('.carousel-img');
            img.classList.remove('fade-in-img');
            setTimeout(() => {
                img.src = images[current];
                img.classList.add('fade-in-img');
            }, 200);
        }
        render();
        intervalId = setInterval(() => {
            current = (current + 1) % images.length;
            fadeToImage();
        }, 4000); // Slower transition: 4 seconds
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            clearInterval(intervalId);
        }
    }
    document.querySelectorAll('.project-card button').forEach((btn, idx) => {
        btn.onclick = function() {
            const card = btn.closest('.project-card');
            const img = card.querySelector('img').getAttribute('src');
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            showModal(img, title, desc);
        };
    });
});