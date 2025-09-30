let editingWeatherID = null

function setdate() {
    let today = new Date().toISOString().split('T')[0]
    let dateField = document.getElementById('newDate')

    dateField.setAttribute('min', today)
}

setdate()

//------------------------ Új időjárás ----------------------------


async function addNewWeather() {
    let newDate = document.getElementById('newDate')
    let newType = document.getElementById('newType')
    let newMin = document.getElementById('newMin')
    let newMax = document.getElementById('newMax')

    if (newDate.value == "" || newType.value == "" || newMin.value == "" || newMax.value == "") {
        Messages('danger', 'Hiba', 'Kitöltetlen adatok')
        return
    } else if (parseFloat(newMin.value) > parseFloat(newMax.value)) {
        Messages('danger', 'Hiba', 'A minimum hőmérséklet nem lehet nagyobb, mint a maximum')
        return
    }

    try {
        let url = `${serverURL}/weather/addNewWeather`
        let method = "POST"

        // Módosítás
        if (editingWeatherID) {
            url = `${serverURL}/weather/modWeather/${editingWeatherID}`
            method = "PATCH"
        }

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: loggedID,
                date: newDate.value,
                type: newType.value,
                min: newMin.value,
                max: newMax.value,
            })
        })

        let data = await res.json()

        if (data.msg == "Módosult") {
            Messages('warning', 'Hiba', 'Erre a napra már van beállítva időjárás')
        }

        if (res.status == 200 && data != null) {
            Messages('success', editingWeatherID ? 'Sikeres módosítás' : 'Sikeres adatbevitel', '')
        }

        editingWeatherID = null
        newDate.value = ''
        newType.value = ''
        newMin.value = ''
        newMax.value = ''

    } catch (err) {
        Messages('danger', 'Sikertelen adatbevitel', `${err}`)
        console.log(err)
    }

    loadData()
}



//------------------------ Táblafeltöltés ----------------------------


async function loadData() {




    try {

        let tbody = document.getElementById('weathersTable')
        tbody.innerHTML = ''


        const res = await fetch(`${serverURL}/weather/${loggedID}`)

        data = await res.json()




        //adatmezők létrahozása
        data.forEach(element => {
            let tr = document.createElement('tr')
            let weatherID = document.createElement('td')
            weatherID.classList.add('text-end')
            weatherID.innerHTML = element.id + '.'

            let datumTD = document.createElement('td')
            datumTD.classList.add('text-end')
            datumTD.innerHTML = element.date

            let typeTD = document.createElement('td')
            typeTD.classList.add('text-end')
            typeTD.innerHTML = element.type

            let minTD = document.createElement('td')
            minTD.classList.add('text-end')
            minTD.innerHTML = element.min + '℃'

            let maxTD = document.createElement('td')
            maxTD.classList.add('text-end')
            maxTD.innerHTML = element.max + '℃'

            let deleteBTN = document.createElement('span')
            deleteBTN.innerHTML = `<button class="btn btn-danger" onclick="deleteWeather(${element.id})">X</button>`

            let modBTN = document.createElement('span')
            modBTN.innerHTML = `<button class="btn btn-primary ms-2" onclick="prepareModWeather(${element.id}, '${element.date}', '${element.type}', ${element.min}, ${element.max})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                </svg></button>`

            tr.appendChild(weatherID)
            tr.appendChild(datumTD)
            tr.appendChild(typeTD)
            tr.appendChild(minTD)
            tr.appendChild(maxTD)

            if (element.userID == loggedID) {
                tr.appendChild(deleteBTN)
                tr.appendChild(modBTN)
            } else {
                let no = document.createElement('p')
                no.innerHTML = "Nem módosítható"
                no.style.color = "var(--bs-secondary)"
                no.style.fontSize = "15px"
                tr.appendChild(no)
            }

            tbody.appendChild(tr)
        })


    } catch (err) {
        Messages('danger', 'Hiba', 'Hiba történt a táblázat betöltése során! \n', err)
    }


}

async function deleteWeather(id) {

    try {
        const res = await fetch(`${serverURL}/weather/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        data = await res.json()



    } catch (err) {
        Messages('danger', 'Hiba', 'Hiba történt a törlés során! \n', err)
    }

    loadData()
}


//adat betöltése módosításkor
function prepareModWeather(id, date, type, min, max) {
    editingWeatherID = id
    document.getElementById('newDate').value = date
    document.getElementById('newType').value = type
    document.getElementById('newMin').value = min
    document.getElementById('newMax').value = max
}




