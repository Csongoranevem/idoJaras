let loggedIn = false
const serverURL = ""

function navChangeIfLoggedIn() {
    if (loggedIn == true) {
        document.getElementById('defaultNav').setAttribute('d-none')
        document.getElementById('loggedNav').removeAttribute('d-none')
        return
    }

    document.getElementById('defaultNav').removeAttribute('d-none')
    document.getElementById('loggedNav').setAttribute('d-none')

}



async function teszt() {
    try {
        const res = await fetch('http://localhost:3000/users/getUser', 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                nev: "Sauher",
                email: "sauermostugrik@citromail.ru",
                password: "SauherHentai6767"
            }

        })

    } catch (err)
    {
        
    }

}

teszt()