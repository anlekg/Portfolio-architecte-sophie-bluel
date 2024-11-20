function fetchFromAPI(url, type, id) {
    let dataArray = []
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données')
            }
            return response.json()
        })
        .then(data => {
            dataArray = data
            if (type === 1) {
                createMenu(dataArray)
            }
            if (type === 2) {
                createGallery(dataArray, id)
            }
        })
        .catch(error => {
            console.error('Erreur :', error)
        })
}

function createMenu(dataArray) {
    const filtersButtons = document.querySelector('.filters-buttons')
    for (let i = 0; i < dataArray.length; i++) {
        const filterButton = document.createElement('input')
        filterButton.classList.add('filter-button')
        filterButton.id = dataArray[i].id
        filterButton.type = 'radio'
        filterButton.name = 'filter'
        filterButton.value = dataArray[i].name
        const label = document.createElement('label')
        label.htmlFor = dataArray[i].id
        label.textContent = dataArray[i].name
        filtersButtons.appendChild(filterButton)
        filtersButtons.appendChild(label)
        fetchFromAPI("http://localhost:5678/api/works", 2, 0)
    }
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedRadio = document.querySelector('input[name="filter"]:checked')
            fetchFromAPI("http://localhost:5678/api/works", 2, parseInt(selectedRadio.id))
        })
    })
}

function createGallery(dataArray, id) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
    for (let i = 0; i < dataArray.length; i++) {
        if (id === 0 || dataArray[i].categoryId === id) {
            const figureElem = document.createElement('figure')
            const imgElem = document.createElement('img')
            const figcaptionElem = document.createElement('figcaption')
            imgElem.src = dataArray[i].imageUrl
            imgElem.alt = dataArray[i].title
            figcaptionElem.textContent = dataArray[i].title
            figureElem.appendChild(imgElem)
            figureElem.appendChild(figcaptionElem)
            gallery.appendChild(figureElem)
        }
    }
}

function editModale() {
    window.addEventListener('DOMContentLoaded', function () {
        const editLink = document.querySelector(".portfolio-title p a")
        let editPictures = "Galerie photo<br>"
        editLink.addEventListener("click", function () {
            event.preventDefault()
            modaleOpen(editPictures)
        })    
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
            if (window.location.pathname === "/index.html") {
                editionMode.style.display = "none"
                editionLink.style.display = "none"
            }
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

function loginForm() {
    window.addEventListener('DOMContentLoaded', function () {
        const formLogin = document.querySelector('#login-form form')
        const emailInput = document.getElementById('username')
        const passwordInput = document.getElementById('password')
        formLogin.addEventListener('submit', async function (event) {
            event.preventDefault()
            const token = await loginAPI(emailInput.value, passwordInput.value)
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

function loginAPI(user, password) {
    return fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"email": "' + user + '","password": "' + password + '"}'
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) modaleOpen("Utilisateur non trouvé")
            if (response.status === 401) modaleOpen("Erreur d'authentification")
        }
        return response.json()
    })
    .then(tokenJson => {
        if (tokenJson.token) return tokenJson.token
    })
    .catch(error => {
        console.error("Erreur lors de la connexion :", error.message);
    })
}

if (window.location.pathname === "/index.html") {
    navLinks()
    fetchFromAPI("http://localhost:5678/api/categories", 1, null)
    editModale()
} else {
    navLinks()
    loginForm()
}