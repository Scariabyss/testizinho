/**
 * Mollab – Efeitos Interativos e Tema Claro/Escuro
 */

function initTheme() {
    var savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme) {
        savedTheme = 'dark'; /* o padrão do site agora é o tech dark mode */
        localStorage.setItem('theme', 'dark');
    }

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon(false);
    } else {
        updateThemeIcon(true);
    }
}

function toggleDarkMode() {
    var isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(!isLight);
}

function updateThemeIcon(isDark) {
    var icon = document.getElementById('theme-icon');
    if (!icon) return;

    if (isDark) {
        /* / Desenha o ícone de Lua */
        icon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
    } else {
        /* / Desenha o ícone de Sol */
        icon.innerHTML = '<circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    /* / Resolve o problema da classe dark-mode que estava no código antes. O padrão é :root puro. */
    document.body.classList.remove('dark-mode');


    initTheme();
    
    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDarkMode);
    }


});
