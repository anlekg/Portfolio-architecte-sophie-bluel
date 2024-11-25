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
            if (type === 1) createMenu(dataArray)
            if (type === 2) createGallery(dataArray, id)
            if (type === 3) createEditModale(dataArray)
            if (type === 4) createUploadForm(dataArray)
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
        filterButton.id = "cat-" + dataArray[i].id
        filterButton.type = 'radio'
        filterButton.name = 'filter'
        filterButton.value = dataArray[i].name
        const label = document.createElement('label')
        label.htmlFor = "cat-" + dataArray[i].id
        label.textContent = dataArray[i].name
        filtersButtons.appendChild(filterButton)
        filtersButtons.appendChild(label)
        fetchFromAPI("http://localhost:5678/api/works", 2, 0)
    }
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedRadio = document.querySelector('input[name="filter"]:checked')
            const catId = parseInt(selectedRadio.id.split('-')[1], 10);
            fetchFromAPI("http://localhost:5678/api/works", 2, catId)
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

function createEditModale(dataArray) {
    const editPicturesDiv = document.createElement('div')
    const editPicturesP = document.createElement('p')
    const editPicturesHR = document.createElement('hr')
    const editPicturesInput = document.createElement('input')
    editPicturesP.textContent = "Galeries photo"
    editPicturesDiv.appendChild(editPicturesP)
    editPicturesDiv.classList.add("edit-grid")
    editPicturesInput.type = "submit"
    editPicturesInput.value = "Ajouter une photo"
    editPicturesInput.classList.add("edit-add-photo")
    for (let i = 0; i < dataArray.length; i++) {
        const editPicturesSpan = document.createElement('span')
        const editPicturesImg = document.createElement('img')
        const editPicturesDelButton = document.createElement('button')
        const editPicturesDelTrash = document.createElement('i')
        editPicturesDelTrash.classList.add("fa-solid")
        editPicturesDelTrash.classList.add("fa-trash-can")
        editPicturesSpan.classList.add("edit-span")
        editPicturesImg.src = dataArray[i].imageUrl
        editPicturesDelButton.id = dataArray[i].id
        editPicturesDelButton.classList.add("delete-button")
        editPicturesSpan.appendChild(editPicturesImg)
        editPicturesDelButton.appendChild(editPicturesDelTrash)
        editPicturesSpan.appendChild(editPicturesDelButton)
        editPicturesDiv.appendChild(editPicturesSpan)
    }
    editPicturesDiv.appendChild(editPicturesHR)
    editPicturesDiv.appendChild(editPicturesInput)
    modaleOpen(editPicturesDiv)
    editPicturesInput.addEventListener('click', function(event) {
        fetchFromAPI("http://localhost:5678/api/categories", 4, null)
    })
    const deleteButtons = document.querySelectorAll(".delete-button")
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const userResponse = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")
            if (userResponse) {
                console.log("L'utilisateur a confirmé la suppression.")
                worksDeleteAPI(button.id)
                location.reload()
            } else console.log("L'utilisateur a annulé la suppression.")
        })
    })
}

function createUploadForm(dataArray) {
    const returnModalButton = document.createElement("button")
    const returnModalArrow = document.createElement("i")
    returnModalButton.classList.add("return-modal")
    returnModalArrow.classList.add("fa-solid")
    returnModalArrow.classList.add("fa-arrow-left")
    returnModalButton.appendChild(returnModalArrow)
    const uploadFormDiv = document.createElement('div')
    const uploadFormP = document.createElement('p')
    const uploadFormHR = document.createElement('hr')
    const uploadForm = document.createElement('form')
    const uploadFormInputPhoto = document.createElement('input')
    const uploadFormInputPhotoLabel = document.createElement('label')
    const uploadFormInputPhotoIcon = document.createElement('i')
    const uploadFormInputPhotoAddText = document.createElement('span')
    const uploadFormInputPhotoFormatText = document.createElement('span')
    const uploadFormInputPhotoPreview = document.createElement('img')
    const uploadFormInputTitle = document.createElement('input')
    const uploadFormInputCat = document.createElement('select')
    const uploadFormInputTitleLabel = document.createElement('label')
    const uploadFormInputCatLabel = document.createElement('label')
    const uploadFormSubmit = document.createElement('input')
    uploadFormDiv.classList.add("edit-grid")
    uploadForm.method = "post"
    uploadFormInputPhoto.type = "file"
    uploadFormInputPhoto.id = "add-photo"
    uploadFormInputPhoto.accept = "image/png, image/jpeg"
    uploadFormInputPhotoLabel.htmlFor = "add-photo"
    uploadFormInputPhotoLabel.classList.add('file-upload-label')
    uploadFormInputPhotoIcon.classList.add('fa-regular')
    uploadFormInputPhotoIcon.classList.add('fa-image')
    uploadFormInputPhotoAddText.classList.add('upload-text')
    uploadFormInputPhotoAddText.textContent = "+ Ajouter photo"
    uploadFormInputPhotoFormatText.textContent = "jpg, png : 4mo max"
    uploadFormInputPhotoFormatText.classList.add('file-format')
    uploadFormInputTitleLabel.htmlFor = "title"
    uploadFormInputTitleLabel.textContent = "Titre"
    uploadFormInputCatLabel.htmlFor = "category"
    uploadFormInputCatLabel.textContent = "Catégorie"
    uploadFormInputTitle.type = "text"
    uploadFormInputTitle.id = "title"
    uploadFormInputCat.name = "category"
    uploadFormInputCat.id = "category"
    uploadFormSubmit.type = "submit"
    uploadFormSubmit.value = "Valider"
    uploadFormInputPhotoLabel.appendChild(uploadFormInputPhotoIcon)
    uploadFormInputPhotoLabel.appendChild(uploadFormInputPhotoAddText)
    uploadFormInputPhotoLabel.appendChild(uploadFormInputPhotoFormatText)
    uploadForm.appendChild(uploadFormInputPhotoLabel)
    uploadForm.appendChild(uploadFormInputPhoto)
    uploadForm.appendChild(uploadFormInputTitleLabel)
    uploadForm.appendChild(uploadFormInputTitle)
    for (let i = 0; i < dataArray.length; i++) {
        const uploadFormInputCatOption = document.createElement('option')
        uploadFormInputCatOption.value = dataArray[i].id
        uploadFormInputCatOption.textContent = dataArray[i].name
        uploadFormInputCat.appendChild(uploadFormInputCatOption)
    }
    uploadForm.appendChild(uploadFormInputCatLabel)
    uploadForm.appendChild(uploadFormInputCat)
    uploadForm.appendChild(uploadFormHR)
    uploadForm.appendChild(uploadFormSubmit)
    uploadFormDiv.appendChild(returnModalButton)
    uploadFormDiv.appendChild(uploadFormP)
    uploadFormDiv.appendChild(uploadForm)
    modaleOpen(uploadFormDiv)
    returnModalButton.addEventListener("click", function () {
        event.preventDefault()
        fetchFromAPI("http://localhost:5678/api/works", 3, null)
    })
    uploadFormInputPhoto.addEventListener("change", (event) => {
        const file = event.target.files[0]
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                uploadFormInputPhotoPreview.src = e.target.result
                uploadFormInputPhotoPreview.classList.add("input-preview")
                uploadFormInputPhotoLabel.innerHTML = ""
                uploadFormInputPhotoLabel.style.padding = "0"
                uploadFormInputPhotoLabel.appendChild(uploadFormInputPhotoPreview)
            }
            reader.readAsDataURL(file);
        }
    })
    uploadFormSubmit.addEventListener("click", function () {
        event.preventDefault()
        const fileInput = uploadFormInputPhoto
        const titleInput = uploadFormInputTitle.value
        const categorySelect = uploadFormInputCat.value

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0]
            worksPostAPI(file, titleInput, categorySelect)
                .then(data => {
                    console.log("Données envoyées avec succès :", data)
                })
                .catch(error => {
                    console.error("Erreur :", error.message)
                })
        } else {
            console.error("Veuillez sélectionner un fichier avant de soumettre.")
        }
    })
}

function worksPostAPI(image, title, category) {
    let token = sessionStorage.getItem("token")
    if (!image || !title || !category) {
        return Promise.reject(new Error("Tous les champs (image, title, category) sont requis."))
    }
    const formData = new FormData()
    formData.append('image', image)
    formData.append('title', title)
    formData.append('category', category)
    return fetch('http://localhost:5678/api/works', {
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
            });
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
                return Promise.reject(new Error(errorMessage))
            });
        }
        return response.text()
    })
    .then(data => {
        console.log("Suppression réussie :", data)
        return data
    })
    .catch(error => {
        console.error("Erreur lors de la requête DELETE :", error.message)
        throw error
    })
}

function editModale() {
    let token = sessionStorage.getItem("token")
    if (token != null) {
        window.addEventListener('DOMContentLoaded', function () {
            const editLink = document.querySelector(".portfolio-title p a")
            const editionMode = document.querySelector(".edition-mode")
            const editionLink = document.querySelector(".portfolio-title p")
            editionMode.style.display = "flex"
            editionLink.style.display = "block"
            document.body.style.marginTop = "80px"
            editLink.addEventListener("click", function () {
                event.preventDefault()
                fetchFromAPI("http://localhost:5678/api/works", 3, null)
            })
        })
    }
}

function navLinks() {
    let token = sessionStorage.getItem("token")
    window.addEventListener('DOMContentLoaded', function () {
        const loginLink = document.querySelector("#login-link")
        if (token != null) {
            loginLink.innerHTML = "logout"
            loginLink.addEventListener("click", () => {
                sessionStorage.clear()
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
                window.location.href = "/FrontEnd/index.html"
            }
        })
    })
}

function modaleOpen(message) {
    const closeModalButton = document.createElement("button")
    const closeModalXmark = document.createElement("i")
    const overlay = document.getElementById("overlay")
    const modal = document.getElementById("modal")
    closeModalButton.classList.add("close-modal")
    closeModalXmark.classList.add("fa-solid")
    closeModalXmark.classList.add("fa-xmark")
    closeModalButton.appendChild(closeModalXmark)
    overlay.style.display = "block"
    modal.innerHTML = ""
    modal.appendChild(closeModalButton)
    modal.appendChild(message)
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
                if (response.status === 401 || response.status === 404) {
                    const message = document.createElement('p')
                    message.textContent = "Erreur d'authentification"
                    modaleOpen(message)
                }
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

if (window.location.pathname === "/FrontEnd/index.html") {
    navLinks()
    fetchFromAPI("http://localhost:5678/api/categories", 1, null)
    editModale()
} else {
    navLinks()
    loginForm()
}