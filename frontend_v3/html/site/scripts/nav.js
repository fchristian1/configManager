if (document.querySelector('nav ul li a') != null) {
    const navItems = document.querySelectorAll('nav ul li a');
    const urlPAth = window.location.pathname;
    navItems.forEach(item => {
        if (item.getAttribute('href') == urlPAth) {
            item.classList.add('active');
        }
    });
}

let token = localStorage.getItem("token");
console.error("!!!the error:\nUncaught SyntaxError: Identifier 'token' has already been declared (at nav.js:1:1)\n comes from the Strikt mode in react on double rendering");
if (token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.email;
        const authLinks = document.getElementById("authLinks");
        authLinks.innerHTML = `<li><a href="/profile/">User</a></li>`;
    } catch (e) {
        console.error("Invalid token", e);
    }
}
