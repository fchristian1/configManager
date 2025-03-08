if (document.querySelector('nav ul li a') != null) {
    const navItems = document.querySelectorAll('nav ul li a');
    const urlPAth = window.location.pathname;
    navItems.forEach(item => {
        if (item.getAttribute('href') == urlPAth) {
            item.classList.add('active');
        }
    });
}