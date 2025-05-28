function sendToBackend() {
    const username = document.getElementById('indexUsernameInput');
    const password = document.getElementById('indexPasswordInput');

    const usernameStr = username.value.trim();
    const passwordDataStr = password.value;

    fetch('/auth/login/data/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "passwordStr": passwordDataStr,
            "usernameStr": usernameStr
        })
    }).then(response => response.json()).then((data) => {
        console.log(data);
        alertNotice.innerHTML = data.res;
        if(data.res.name) {
            window.location.replace('/chat/')
        }
    })
}