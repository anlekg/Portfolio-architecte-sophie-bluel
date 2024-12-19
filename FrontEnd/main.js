// Fonction principale qui initialise l'application JS
main()

function main() {
    // Récupère le token de session et l'element qui affiche login en haut à droite
    let token = sessionStorage.getItem("token")
    const loginLink = document.querySelector("#login-link")
    
    // Si un token existe, change le texte du lien en "logout" et ajoute un event listener pour déconnecter
    if (token != null) {
        loginLink.textContent = "logout"
        loginLink.addEventListener("click", () => {
            sessionStorage.clear()
        })
    }

    // Lance la chaîne de fonction apropriée selon la page
    if (window.location.pathname === "/FrontEnd/index.html") {
        fetchFromAPI("http://localhost:5678/api/categories", 1, null)
    } else {
        loginForm()
    }
}

// Fonction principale qui sert de relais pour une grande partie des actions du site et qui utilise l'API fournise
function fetchFromAPI(url, type, id) {
    let dataArray = []
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données")
            }
            return response.json()
        })
        .then(data => {
            dataArray = data
            // Appelle la fonction appropriée selon le type de données reçues par l'API et l'action entreprie par l'utilisateur
            switch (type) {
                case 1:
                    createMenu(dataArray)
                    break
                case 2:
                    createGallery(dataArray, id)
                    break
                case 3:
                    createEditModale(dataArray)
                    break
                case 4:
                    createUploadForm(dataArray)
                    break
            }
        })
        .catch(error => {
            alert("Erreur :", error)
        })
}

// Crée le menu de filtres des catégories
function createMenu(dataArray) {
    const filtersButtons = document.querySelector(".filters-buttons")
    // Crée un bouton radio pour chaque catégorie
    for (let i = 0; i < dataArray.length; i++) {
        const filterButton = document.createElement("input")
        filterButton.classList.add("filter-button")
        filterButton.id = "cat-" + dataArray[i].id
        filterButton.type = "radio"
        filterButton.name = "filter"
        filterButton.value = dataArray[i].name
        const label = document.createElement("label")
        label.htmlFor = "cat-" + dataArray[i].id
        label.textContent = dataArray[i].name
        filtersButtons.appendChild(filterButton)
        filtersButtons.appendChild(label)
        fetchFromAPI("http://localhost:5678/api/works", 2, 0)
    }
    editModale()
    // Ajoute les event listeners pour filtrer la galerie
    document.querySelectorAll("input[name='filter']").forEach(radio => {
        radio.addEventListener("change", () => {
            const selectedRadio = document.querySelector("input[name='filter']:checked")
            const catId = parseInt(selectedRadio.id.split("-")[1], 10)
            fetchFromAPI("http://localhost:5678/api/works", 2, catId)
        })
    })
}

// Crée la galerie de projets
function createGallery(dataArray, id) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
    // Crée un élément figure pour chaque projet correspondant au filtre, et pour toute les catégories si id = 0
    for (let i = 0; i < dataArray.length; i++) {
        if (id === 0 || dataArray[i].categoryId === id) {
            const figureElem = document.createElement("figure")
            const imgElem = document.createElement("img")
            const figcaptionElem = document.createElement("figcaption")
            imgElem.src = dataArray[i].imageUrl
            imgElem.alt = dataArray[i].title
            figcaptionElem.textContent = dataArray[i].title
            figureElem.appendChild(imgElem)
            figureElem.appendChild(figcaptionElem)
            gallery.appendChild(figureElem)
        }
    }
}

// Affiche la modale d'édition
function createEditModale(dataArray) {
    const closeModalButton = document.getElementById("close-modal")
    const overlay = document.getElementById("overlay")
    const modal = document.getElementById("modal")
    const uploadForm = document.getElementById("upload-form")
    overlay.style.display = "block"
    modal.style.display = "block"
    const editPicturesDiv = document.getElementById("edit-grid")
    const editPicturesContainer = document.getElementById("edit-pictures")
    const editPicturesInput = document.getElementById("edit-add-photo")
    editPicturesContainer.innerHTML = "" // Remise à 0 du conteneur avant de fetch de nouveau les éléments en cas de repassage dans cette boucle de l'application
    // Crée les éléments pour chaque projet dans la modale
    for (let i = 0; i < dataArray.length; i++) {
        const editPicturesSpan = document.createElement("span")
        const editPicturesImg = document.createElement("img")
        const editPicturesDelButton = document.createElement("button")
        const editPicturesDelTrash = document.createElement("i")
        editPicturesDelTrash.classList.add("fa-solid")
        editPicturesDelTrash.classList.add("fa-trash-can")
        editPicturesSpan.classList.add("edit-span")
        editPicturesImg.src = dataArray[i].imageUrl
        editPicturesDelButton.id = dataArray[i].id
        editPicturesDelButton.classList.add("delete-button")
        editPicturesSpan.appendChild(editPicturesImg)
        editPicturesDelButton.appendChild(editPicturesDelTrash)
        editPicturesSpan.appendChild(editPicturesDelButton)
        editPicturesContainer.appendChild(editPicturesSpan)
    }
    // Ajoute les event listeners pour fermer la modale (Croix + Fond grisé)
    closeModalButton.addEventListener("click", () => {
        hideModale()
    })
    overlay.addEventListener("click", () => {
        hideModale()
    })
    editPicturesDiv.style.display = "flex" // Une fois tout les éléments chargés, affiche la grille d'édition
    editPicturesInput.addEventListener("click", function () {
        fetchFromAPI("http://localhost:5678/api/categories", 4, null)
    })
    // Ajoute les event listeners pour supprimer les projets
    const deleteButtons = document.querySelectorAll(".delete-button")
    deleteButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const userResponse = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")
            if (userResponse) {
                try {
                    await worksDeleteAPI(button.id)
                    hideModale()
                    fetchFromAPI("http://localhost:5678/api/works", 2, 0)
                } catch (error) {
                    alert(`Erreur lors de la suppression : ${error.message}`)
                }
            }
        })
    })
}

// Cache la modale
function hideModale() {
    const overlay = document.getElementById("overlay")
    const modal = document.getElementById("modal")
    const uploadForm = document.getElementById("upload-form")
    overlay.style.display = "none"
    modal.style.display = "none"
    uploadForm.style.display = "none"
}

// Masque la grille d'édition et affiche le formulaire d'upload
function createUploadForm(dataArray) {
    const editPicturesDiv = document.getElementById("edit-grid")
    editPicturesDiv.style.display = "none"
    const uploadForm = document.getElementById("upload-form")
    uploadForm.style.display = "flex"
    const uploadFormInputTitle = document.getElementById("title")
    const uploadFormInputCat = document.getElementById("category")
    const uploadFormInputPhoto = document.getElementById("add-photo")
    const uploadFormInputPhotoLabel = document.getElementById("file-upload-label")
    const returnModalButton = document.getElementById("return-modal")
    const uploadFormSubmit = document.getElementById("add-submit")
    uploadFormInputCat.innerHTML = ""
    // Crée les options de catégories
    for (let i = 0; i < dataArray.length; i++) {
        const uploadFormInputCatOption = document.createElement("option")
        uploadFormInputCatOption.value = dataArray[i].id
        uploadFormInputCatOption.textContent = dataArray[i].name
        uploadFormInputCat.appendChild(uploadFormInputCatOption)
    }
    // Ajoute l'event listener pour retourner à la modale précédente
    returnModalButton.addEventListener("click", function (e) {
        e.preventDefault()
        uploadForm.style.display = "none"
        fetchFromAPI("http://localhost:5678/api/works", 3, null)
    })
    // Gère la prévisualisation de l'image
    uploadFormInputPhoto.addEventListener("change", (event) => {
        const file = event.target.files[0]
        const uploadFormInputPhotoPreview = document.createElement("img")
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                uploadFormInputPhotoPreview.src = e.target.result
                uploadFormInputPhotoPreview.classList.add("input-preview")
                uploadFormInputPhotoLabel.innerHTML = ""
                uploadFormInputPhotoLabel.classList.add("file-upload-label-loaded")
                uploadFormInputPhotoLabel.appendChild(uploadFormInputPhotoPreview)
            }
            reader.readAsDataURL(file)
        }
    })
    // Gère la soumission du formulaire
    uploadFormSubmit.addEventListener("click", async function (e) {
        e.preventDefault()
        const fileInput = uploadFormInputPhoto
        const titleInput = uploadFormInputTitle.value
        const categorySelect = uploadFormInputCat.value

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0]
            try {
                await worksPostAPI(file, titleInput, categorySelect)
                .then(data => {
                    hideModale()
                    uploadFormInputPhoto.value = "",
                    uploadFormInputTitle.value = "",
                    fetchFromAPI("http://localhost:5678/api/works", 2, 0)
                })
                .catch(error => {
                    alert("Erreur :", error.message)
                })
            } catch (error) {
                alert(`Erreur lors de l'ajout : ${error.message}`);
            }
        } else {
            alert("Veuillez sélectionner un fichier avant de soumettre.")
        }
    })
}

// Envoie un nouveau projet à l'API
function worksPostAPI(image, title, category) {
    let token = sessionStorage.getItem("token")
    if (!image || !title || !category) {
        return Promise.reject(new Error("Tous les champs (image, title, category) sont requis."))
    }
    const formData = new FormData()
    formData.append("image", image)
    formData.append("title", title)
    formData.append("category", category)
    return fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    const errorMessage = errorData.message || `Erreur HTTP : ${response.status}`
                    return Promise.reject(new Error(errorMessage))
                })
            }
            return response.json()
        })
        .then(data => {
            console.log("Requête réussie :", data)
            return data
        })
        .catch(error => {
            console.error("Erreur lors de la requête POST :", error.message)
            throw error
        })
}

// Supprime un projet via l'API
function worksDeleteAPI(workId) {
    let token = sessionStorage.getItem("token")
    if (!workId) {
        return Promise.reject(new Error("L'ID de l'élément est requis."))
    }
    return fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    const errorMessage = errorData.message || `Erreur HTTP : ${response.status}`
                    alert(errorMessage)
                })
            }
        })
        .then(data => {
            return data
        })
        .catch(error => {
            throw error
        })
}

// Configure l'affichage du mode édition lorsque l'utilisateur est connecté
function editModale() {
    let token = sessionStorage.getItem("token")
    if (token != null) {
        const editLink = document.querySelector(".portfolio-title p a")
        const editionMode = document.querySelector(".edition-mode")
        const editionLink = document.querySelector(".portfolio-title p")
        editionMode.style.display = "flex"
        editionLink.style.display = "block"
        document.body.style.marginTop = "80px"
        editLink.addEventListener("click", function (e) {
            e.preventDefault()
            fetchFromAPI("http://localhost:5678/api/works", 3, null)
        })
    }
}

// Gère le formulaire de connexion
function loginForm() {
    const formLogin = document.querySelector("#login-form form")
    const emailInput = document.getElementById("username")
    const passwordInput = document.getElementById("password")
    formLogin.addEventListener("submit", async function (e) {
        e.preventDefault()
        const token = await loginAPI(emailInput.value, passwordInput.value)
        if (typeof token === "string") {
            sessionStorage.setItem("token", token)
            window.location.href = "/FrontEnd/index.html"
        }
    })
}

// Gère l'authentification via l'API
function loginAPI(user, password) {
    return fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"email": "' + user + '","password": "' + password + '"}'
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 404) {
                    alert("Erreur d'authentification")
                }
            }
            return response.json()
        })
        .then(tokenJson => {
            if (tokenJson.token) return tokenJson.token
        })
        .catch(error => {
            console.error("Erreur lors de la connexion :", error.message)
        })
}