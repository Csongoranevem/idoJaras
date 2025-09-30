//deklarálások

let loggedIn = sessionStorage.getItem('loggedIn') === 'true' ? true : false;
const serverURL = "http://localhost:3000"
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let loggedID = sessionStorage.getItem('loggedID') ? Number(sessionStorage.getItem('loggedID')) : null;


const container = document.getElementById('profileBanner');
const dataField = document.createElement('div');



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

//------------------------ Login ----------------------------

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
            Messages('danger', 'Sikertelen bejelentkezés', `Helytelen jelszó (A jelszónak 8 karakterből kell álljon, tartalmaznia kell kis betűt, nagy betűt és számot)`)
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
            Render('main')
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

//------------------------ Registration ----------------------------

async function registration() {

    let name = document.getElementById('registrationName')
    let email = document.getElementById('registrationEmail')
    let password = document.getElementById('registrationPassword')
    let passwordAgain = document.getElementById('registrationPasswordAgain')

    if (passwordAgain.value == "" || password.value == "" || email.value == "", name.value == "") {
        Messages('danger', 'Hiba', 'Kitöltetlen adatok')
    }
    else if (!passwdRegExp.test(password.value)) {
        Messages('danger', 'Sikertelen bejelentkezés', `A jelszónak 8 karakterből kell álljon, tartalmaznia kell kis betűt, nagy betűt és számot`)
    }

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



        let data = await res.json()

        if (data.msg == "Ez az mail már foglalt") {
            Messages('danger', 'Hiba', 'foglalt e-mail cím')
        }

        //console.log(data)

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

//------------------------ Profile Fill ----------------------------

async function profileDataFill() {

    let profileName = document.getElementById('profileName')
    let profileEmail = document.getElementById('profileEmail')
    let profilePassword = document.getElementById('profilePassword')


    try {
        const res = await (await fetch(`${serverURL}/users/getUser/${loggedID}`))

        let data = await res.json()

        profileName.value = data.name
        profileEmail.value = data.email
        profilePassword.value = data.password


    } catch (err) {
        Messages('danger', 'Hiba', 'Nem sikerült betölteni az adatokat.')
    }

}

//------------------------ Profile mod ----------------------------


function modProfile() {

    let profileName = document.getElementById('profileName')
    let profileEmail = document.getElementById('profileEmail')
    let profilePassword = document.getElementById('profilePassword')

    if (profileName.value == "" || profileEmail.value == "" || profilePassword.value == "") {
        Messages('danger', 'Hiba', 'Kitöltetlen adatok.')
        return
    }
    else if (!passwdRegExp.test(profilePassword.value)) {
        Messages('danger', 'Sikertelen bejelentkezés', `A jelszónak 8 karakterből kell álljon, tartalmaznia kell kis betűt, nagy betűt és számot`)
        return
    }
    else if (!regexMail.test(profileEmail.value)) {
        Messages('danger', 'Sikertelen bejelentkezés', `Helytelen e-mail`)
        return
    }

    readonlyHandler(true)

    
}



async function saveProfile() {

    try {
        const res = await fetch(`${serverURL}/users/modProfile`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: loggedID,
                name: profileName.value,
                email: profileEmail.value,
                password: profilePassword.value
            })
        })
        let data = await res.json()

        if (profilePassword.value != data.password) {

            OldPasswordneeded()
        }

        else{
            Messages('success', 'Sikeres adatmódosítás.', '')
        }


    } catch (err) {
        Messages('danger', 'Hiba', 'Nem sikerült módosítani az adatokat.')
    }

    profileDataFill()
    readonlyHandler(false)

}

//Segédfüggvények a módosításhoz

async function OldPasswordneeded() {

    container.removeChild(dataField);


    // Létrehozzuk a régi jelszó fieldjét
    dataField.className = 'dataField';

    const passwordLabel = document.createElement('p');
    passwordLabel.className = 'profilePasswordAgain col-sm-4 col-lg-4';
    passwordLabel.innerHTML = '<strong>Jelszó</strong>';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'oldPassword';
    passwordInput.className = 'form-control col-sm-8';

    dataField.appendChild(passwordLabel);
    dataField.appendChild(passwordInput);

    container.appendChild(dataField);



}

function readonlyHandler(mod) {
    if (mod) {
        profileName.removeAttribute("readonly")
        profileEmail.removeAttribute("readonly")
        profilePassword.removeAttribute("readonly")

    }
    else {
        profileName.setAttribute("readonly", true)
        profileEmail.setAttribute("readonly", true)
        profilePassword.setAttribute("readonly", true)

    }

}
navChangeIfLoggedIn()