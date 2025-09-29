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

    }
    else if (newMin.value>newMax.value) {
        Messages('danger', 'Hiba', 'A minimum hőmérséklet nem lehet nagyobb, mint a maximum')
        return

    }

    try {
        const res = await fetch(`${serverURL}/weather/addNewWeather`,
            {
                method: "POST",                                                             // <------ Login API hívás
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //adatok
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

        //console.log(data)

        if (res.status == 200 && data != null) {
            Messages('success', 'Sikeres adatbevitel', '')
        }


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

        data =  await res.json()
        



    data.forEach(element => {

        let tr = document.createElement('tr')
        let weatherID = document.createElement('td')
        weatherID.classList.add('text-end')
        let datumTD = document.createElement('td')
        datumTD.classList.add('text-end')
        let typeTD = document.createElement('td')
        typeTD.classList.add('text-end')
        let minTD = document.createElement('td')
        minTD.classList.add('text-end')
        let maxTD = document.createElement('td')
        maxTD.classList.add('text-end')
        let deleteBTN = document.createElement('span')


        weatherID.innerHTML = element.id + '.'
        datumTD.innerHTML = element.date
        typeTD.innerHTML = element.type
        minTD.innerHTML = element.min + '℃'
        maxTD.innerHTML += element.max + '℃'
        deleteBTN.innerHTML = `<button class="btn btn-danger" id="deleteOne" onclick="deleteWeather(${element.id})">X</button>`

        tr.appendChild(weatherID)
        tr.appendChild(datumTD)
        tr.appendChild(typeTD)
        tr.appendChild(minTD)
        tr.appendChild(maxTD)
        tr.appendChild(deleteBTN)

        tbody.appendChild(tr)
        

        
    })



    } catch (err) {
        ShowMessages('danger', 'Hiba', 'Hiba történt a táblázat betöltése során! \n', err)
    }


}

async function deleteWeather(id) {

    try {
        const res = await fetch(`${serverURL}/weather/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }})

        data =  await res.json()


    
    } catch (err) {
        ShowMessages('danger', 'Hiba', 'Hiba történt a törlés során! \n', err)
    }

    loadData()
}



