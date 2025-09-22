let loggedIn = false


function navChangeIfLoggedIn() {
    if (loggedIn == true) {
        document.getElementById('defaultNav').setAttribute('d-none')
        document.getElementById('loggedNav').removeAttribute('d-none')
        return
    }

    document.getElementById('defaultNav').removeAttribute('d-none')
    document.getElementById('loggedNav').setAttribute('d-none')

}