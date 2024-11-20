async function main() {
    const projectsAPI = await fetch('http://localhost:5678/api/works')
    const projectsList = await projectsAPI.json()
    const gallery = document.querySelector(".gallery")

    for (let i = 0; i < projectsList.length; i++) {
        gallery.innerHTML += '<figure><img src="' + projectsList[i].imageUrl + '" alt="' + projectsList[i].title + '"><figcaption>' + projectsList[i].title + '</figcaption></figure>'
    }

    const categoriesAPI = await fetch('http://localhost:5678/api/categories')
    const categoriesList = await categoriesAPI.json()
    const filterButtons = document.querySelector('.filters-buttons')
    filterButtons.innerHTML += '<button class="filter-button" id="filter-0">Tous</button>'

    for (let i = 0; i < categoriesList.length; i++) {
        filterButtons.innerHTML += '<button class="filter-button" id="filter-' + categoriesList[i].id + '">' + categoriesList[i].name + '</button>'
    }

    const buttonAll = document.querySelector("#filter-0")
    buttonAll.addEventListener("click", function () {
        gallery.innerHTML = ""
        for (let i = 0; i < projectsList.length; i++) {
            gallery.innerHTML += '<figure><img src="' + projectsList[i].imageUrl + '" alt="' + projectsList[i].title + '"><figcaption>' + projectsList[i].title + '</figcaption></figure>'
        }
    })

    const buttonObjects = document.querySelector("#filter-1")
    buttonObjects.addEventListener("click", function () {
        gallery.innerHTML = ""
        for (let i = 0; i < projectsList.length; i++) {
            if (projectsList[i].categoryId == 1) {
                gallery.innerHTML += '<figure><img src="' + projectsList[i].imageUrl + '" alt="' + projectsList[i].title + '"><figcaption>' + projectsList[i].title + '</figcaption></figure>'
            }
        }
    })

    const buttonRooms = document.querySelector("#filter-2")
    buttonRooms.addEventListener("click", function () {
        gallery.innerHTML = ""
        for (let i = 0; i < projectsList.length; i++) {
            if (projectsList[i].categoryId == 2) {
                gallery.innerHTML += '<figure><img src="' + projectsList[i].imageUrl + '" alt="' + projectsList[i].title + '"><figcaption>' + projectsList[i].title + '</figcaption></figure>'
            }
        }
    })

    const buttonHotels = document.querySelector("#filter-3")
    buttonHotels.addEventListener("click", function () {
        gallery.innerHTML = ""
        for (let i = 0; i < projectsList.length; i++) {
            if (projectsList[i].categoryId == 3) {
                gallery.innerHTML += '<figure><img src="' + projectsList[i].imageUrl + '" alt="' + projectsList[i].title + '"><figcaption>' + projectsList[i].title + '</figcaption></figure>'
            }
        }
    })

    const editLink = document.querySelector(".portfolio-title p a")
    let editPictures = "Galerie photo<br>" 
    editLink.addEventListener("click", function () {
        event.preventDefault()
        for (let i = 0; i < projectsList.length; i++) {
            editPictures += '<img src="' + projectsList[i].imageUrl + '" alt="' + projectsList[i].title + '" style="height:120px">'
        }
        modaleOpen(editPictures)
    })
}

function navLinks() {
    let token = sessionStorage.getItem("token")
    console.log(token)
    window.addEventListener('DOMContentLoaded', function () {
        const instaLink = document.querySelector("#instagram-link")
        instaLink.addEventListener("click", () => {
            window.location.href = "https://instagram.com/"
        })

        const projectLink = document.querySelector("#project-link")
        projectLink.addEventListener("click", () => {
            window.location.href = "index.html#portfolio"
        })

        const contactLink = document.querySelector("#contact-link")
        contactLink.addEventListener("click", () => {
            window.location.href = "index.html#contact"
        })

        const loginLink = document.querySelector("#login-link")
        const editionMode = document.querySelector(".edition-mode")
        const editionLink = document.querySelector(".portfolio-title p")
        if (token === null) {
            editionMode.style.display = "none"
            editionLink.style.display = "none"
            loginLink.addEventListener("click", () => {
                window.location.href = "login.html"
            })
        }
        else {
            loginLink.innerHTML = "logout"
            loginLink.addEventListener("click", () => {
                sessionStorage.clear()
                window.location.href = "login.html"
            })
        }
    })
}

// email: sophie.bluel@test.tld

// password: S0phie 

function loginForm() {
    window.addEventListener('DOMContentLoaded', function () {
        const formLogin = document.querySelector('#login-form form')
        const emailInput = document.getElementById('username')
        const passwordInput = document.getElementById('password')
        formLogin.addEventListener('submit', async function (event) {
            event.preventDefault()
            const token = await loginAPI(emailInput.value, passwordInput.value)
            if (token === 404) {
                modaleOpen("Utilisateur inconnu")
            }
            if (token === 401) {
                modaleOpen("Mot de passe incorrect")
            }
            if (typeof token === 'string') {
                sessionStorage.setItem("token", token);
                window.location.href = "index.html"
            }
        })
    })
}

function modaleOpen(message) {
    const closeModalButton = document.getElementById("close-modal")
    const overlay = document.getElementById("overlay")
    const modal = document.getElementById("modal")
    overlay.style.display = "block"
    modal.innerHTML = '<button id="close-modal">X</button><p>' + message + '</p>'
    modal.style.display = "block"
    closeModalButton.addEventListener("click", () => {
        overlay.style.display = "none"
        modal.style.display = "none"
    })
    overlay.addEventListener("click", () => {
        overlay.style.display = "none"
        modal.style.display = "none"
    })
}

async function loginAPI(user, password) {
    const token = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"email": "' + user + '","password": "' + password + '"}'
    })
    const tokenJson = await token.json()
    if (tokenJson.message === "user not found") {
        return (404)
    }
    if (tokenJson.error != null) {
        return (401)
    }
    else {
        return (tokenJson.token)
    }
}

if (window.location.pathname === "/index.html") {
    main()
    navLinks()
} else {
    navLinks()
    loginForm()
}