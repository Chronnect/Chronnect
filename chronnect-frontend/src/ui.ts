export function initMenu() {
    const menuToggle = document.getElementById('menu-toggle') as HTMLElement;
    const mainNav = document.getElementById('main-nav') as HTMLElement;
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        toggleMenu(mainNav);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });

    document.addEventListener('click', (event) => {
        if (!mainNav.contains(event.target as Node) && !menuToggle.contains(event.target as Node)) {
            mainNav.classList.remove('active');
        }
    });
}

export function toggleMenu(mainNav: HTMLElement) {
    mainNav.classList.toggle('active');
}

export function initSections() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const target = event.target as HTMLElement;
            const sectionId = target.getAttribute('href');
            if (sectionId && sectionId.startsWith('#')) {
                showSection(sectionId.substring(1), sections);
            }
        });
    });

    handleInitialSectionDisplay();
}

export function showSection(sectionId: string, sections: NodeListOf<Element>) {
    sections.forEach(section => section.classList.remove('active'));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

function handleInitialSectionDisplay() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash, document.querySelectorAll('.content-section'));
    }
}
