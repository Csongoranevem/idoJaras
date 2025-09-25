

async function addNewWeather() {
    try {
        const res = await fetch(`${serverURL}/weather/addNewWeather`,
            {
                method: "POST",                                                             // <------ Login API hívás
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //adatok

                })

            })
    } catch (err) {
        
    }
}