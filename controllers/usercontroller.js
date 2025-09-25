//deklarálások

let loggedIn = sessionStorage.getItem('loggedIn') === 'true' ? true : false;
const serverURL = "http://localhost:3000"
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let loggedID = sessionStorage.getItem('loggedID') ? Number(sessionStorage.getItem('loggedID')) : null;

function navChangeIfLoggedIn() {
    if (loggedIn == true) {
        document.getElementById('defaultNav').classList.add('d-none')
        document.getElementById('loggedNav').classList.remove('d-none')
        return
    }                                                                                   // <------ Menü változtatása
    else {
        document.getElementById('defaultNav').classList.remove('d-none')
        document.getElementById('loggedNav').classList.add('d-none')
        return

    }
}

async function login() {
    try {

        let userEmail = document.getElementById('loginEmail')
        let userPassword = document.getElementById('loginPassword')

        // Beviteli mezők ellenőrzése

        if (!userPassword.value || !userEmail.value || userEmail.value == '' || userPassword.value == '') {
            Messages('danger', 'Sikertelen bejelentkezés', `Kitöltetlen adatok`)
            return

        }
        else if (!regexMail.test(userEmail.value)) {
            Messages('danger', 'Sikertelen bejelentkezés', `Helytelen e-mail`)
            return
        }
        else if (!passwdRegExp.test(userPassword.value)) {
            Messages('danger', 'Sikertelen bejelentkezés', `A jelszónak 8 karakterből kell álljon, tartalmaznia kell kis betűt, nagy betűt és számot`)
            return

        }

        const res = await fetch(`${serverURL}/users/login`,
            {
                method: "POST",                                                             // <------ Login API hívás
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userEmail.value,
                    password: userPassword.value
                })
            })
        const data = await res.json()
        if (res.status == 200 && data != null) {
            loggedIn = true
            loggedID = data.id
            sessionStorage.setItem('loggedID', loggedID)
            sessionStorage.setItem("loggedIn", loggedIn)
            Messages('success', 'Sikeres bejelentkezés', '')
            navChangeIfLoggedIn()
        }
        else {
            loggedIn = false;
            loggedID = null;
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('loggedID');
        }
    }
    catch (err) {
        Messages('danger', 'Sikertelen bejelentkezés', `${err}`)
        console.log(err)
    }
}

async function registration() {

    let name = document.getElementById('registrationName')
    let email = document.getElementById('registrationEmail')
    let password = document.getElementById('registrationPassword')
    let passwordAgain = document.getElementById('registrationPasswordAgain')

    try {
        const res = await fetch(`${serverURL}/users/registration`,
            {
                method: "POST",                                                             // <------ Login API hívás
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    password: password.value
                })
            })



        let data = res.json()

        console.log(data)

        if (res.status == 200 && data != null) {
            Messages('success', 'Sikeres regisztráció', '')
        }
    } catch (err) {
        Messages('danger', 'Sikertelen regisztráció', `${err}`)
        console.log(err)
    }
}

function logout() {
    loggedID = null
    loggedIn = false
    sessionStorage.clear()
}

navChangeIfLoggedIn()