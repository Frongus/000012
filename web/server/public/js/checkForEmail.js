var indexEmail;
const registerEmailInput = document.getElementById('email');

function onLoad() {
    try {
        indexEmail = window.localStorage.getItem('indexEmail');
        registerEmailInput.value = indexEmail
    } catch (error) {
        return
    }
}

onLoad();