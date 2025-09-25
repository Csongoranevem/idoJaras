

async function addNewWeather() {
    let newDate = document.getElementById('newDate')
    let newType = document.getElementById('newType')
    let newMin = document.getElementById('newMin')
    let newMax = document.getElementById('newMax')

    try {
        const res = await fetch(`${serverURL}/weather/addNewWeather`,
            {
                method: "POST",                                                             // <------ Login API hívás
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //adatok
                    date: newDate.value,
                    type: newType.value,
                    min: newMin.value,
                    max: newMax.value,
                })

            })
    } catch (err) {
        
    }
}