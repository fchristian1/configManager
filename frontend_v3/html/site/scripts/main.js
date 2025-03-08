if (document.querySelector('main aside') != null) {
    const asideMenuIcon = document.querySelector('#asideMenuIcon');
    const asideMenu = document.querySelector('main aside');

    asideMenuIcon.addEventListener('click', () => {
        asideMenu.classList.toggle('open');
        asideMenu.classList.toggle('normal');
    });
}
