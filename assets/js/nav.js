document.addEventListener("DOMContentLoaded", function () {
    const sNav = document.querySelector('.sidenav');
    const dropdown = document.querySelectorAll('.dropdown-trigger');
    const loader = document.querySelector('.preloader-background');
    const mainDisplay = document.querySelector('#main-display');
    M.Sidenav.init(sNav);
    M.Dropdown.init(dropdown, {
        over: true,
        belowOrigin: true,
        alignment: 'right'
    })

    // preload
    loader.classList.add('fade-out');

    // load content
    var page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadpage(page);
});

function initCollapsable() {
    const collaps = document.querySelectorAll('.collapsible');
    M.Collabsible.init(collaps);
}

function loadnav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status != 200) return;

            document.querySelector('.topnav').innerHTML = xhttp.responseText;
            document.querySelector('.mobilenav').innerHTML = xhttp.responseText;

            document.querySelectorAll('.sidenav a, .topnav a').forEach(e => {
                e.addEventListener('click', click => {
                    let sidenav = document.querySelector(".sidenav");
                    M.Sidenav.getInstance(sidenav).close();

                    let page = click.target.getAttribute('href').substr(1);
                    console.log(page)
                    loadpage(page);
                })
            })
        }
    }

    xhttp.open("GET", "nav.html", true);
    xhttp.send();
}

function loadpage(page) {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `pages/${page}.html`, true);
    xhttp.send();

    return new Promise((resolve, reject) => {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                const content = document.querySelector('#main-display');

                if (page === "home") {
                    displayKlasemen();
                }
                else if (page === "match") {
                    displayMatch();
                }
                else if (page === "fav-team") {
                    displaySavedTeams();
                }

                if (this.status === 200) {
                    content.innerHTML = xhttp.responseText;
                }
                else if (this.status === 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                    reject(new Error(`http.status : 404 || file not found`));
                }
                else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                    reject(new Error(`error http.status : ${xhttp.status}`));
                }
            }
        };
    })
}

