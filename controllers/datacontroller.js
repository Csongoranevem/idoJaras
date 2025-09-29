let calEvents = []

async function getCalendar() {
    try {
        let res = await fetch(`${serverURL}/weather/${loggedID}`);
        weather = await res.json();
        calEvents = [];
        weather.forEach(w => {
            calEvents.push(
                {
                title: 'Idő: ' + w.type,
                start: w.date
                },
                {
                    title: 'Min: ' + w.min + '°C',
                    start: w.date,
                    backgroundColor: 'green'
                },
                {
                    title: 'Max: ' + w.max + "°C",
                    start: w.date,
                    backgroundColor: 'red'

                },
            );
        });
    } catch (err) {
        console.log(err);
        Messages('danger', 'Hiba', 'Hiba az adatok lekérdezése során!');
    }
}



function initCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: 'dayGridMonth',
        locale: 'en',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        events: calEvents
    });
    calendar.render();
}