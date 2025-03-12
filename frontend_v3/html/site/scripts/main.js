if (document.querySelector('#asideMenuIcon') != null) {
    const asideMenuIcon = document.querySelector('#asideMenuIcon');
    const asideMenu = document.querySelector('main aside');

    asideMenuIcon.addEventListener('click', () => {
        asideMenu.classList.toggle('open');
        asideMenu.classList.toggle('normal');
    });
}
if (document.querySelector('#logout') != null) {
    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('token');

        window.location.href = '/login/';
    });
}

