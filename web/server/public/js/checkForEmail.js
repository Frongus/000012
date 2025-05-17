var indexEmail;
const registerEmailInput = document.getElementById('indexEmailInput');

function onLoad() {
    try {
        indexEmail = window.localStorage.getItem('indexEmail');
        console.log(indexEmail)
        registerEmailInput.value = indexEmail
    } catch (error) {
        return
    }
}

onLoad();