//deklarálások

let loggedIn = sessionStorage.getItem('loggedIn') ? sessionStorage.getItem('loggedIn') : false
const serverURL = "http://localhost:3000"
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


function navChangeIfLoggedIn() {
    if (loggedIn == true) {
        document.getElementById('defaultNav').classList.add('d-none')
        document.getElementById('loggedNav').classList.remove('d-none')
        return
    }                                                                                   // <------ Menü változtatása
    else {
        document.getElementById('defaultNav').classList.remove('d-none')
        document.getElementById('loggedNav').classList.remove('d-none')
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
        sessionStorage.setItem("loggedIn", loggedIn)
        Messages('success', 'Sikeres bejelentkezés', '')
        navChangeIfLoggedIn()

    }
    else{
        loggedIn = false
    }
}

    catch (err) {
    Messages('danger', 'Sikertelen bejelentkezés', `${err}`)
    console.log(err)
}

}

navChangeIfLoggedIn()
