var chart = null
let chartLabels = [];
let chartData = [];
const iconURL = "../icons/"
let icon;

let weatherdatas = []

function initChart() {
    chartData = []

    weatherdatas.forEach(weatherdata => {
        getIcon(weatherdata.type)
        wObj = {
            icon: icon,
            label: weatherdata.date,
            y: [Number(weatherdata.min), Number(weatherdata.max)],
            name: weatherdata.type,
            time: weatherdata.date
        }

        chartData.push(wObj)
    })


    let i = 0;
    chart = new CanvasJS.Chart("chartContainer", {
        theme: getTheme(),
        title: {
            text: "Heti előrejelzés"
        },
        axisY: {
            suffix: " °C",
            maximum: 50,
            gridThickness: 0.1
        },
        toolTip: {
            shared: true,
            content: `<p class="text-start">{time}</p> <br> Időjárás:<strong>{name}</strong><br><strong>{y[0]}</strong>°C - <strong>{y[1]}</strong>°C `
        },
        data: [{
            type: "rangeSplineArea",
            fillOpacity: 0.2,
            color: "lightblue",
            indexLabelFormatter: formatter,
            dataPoints: chartData
        }]
        
    });

    chart.render();
}



async function getChartData() {
    try {
        const res = await fetch(`${serverURL}/weather/`);
        let data = await res.json();

        weatherdatas = data

        data = data.sort((a, b) => new Date(a.date) - new Date(b.date));

        chartLabels = [];
        minDataPoints = [];
        maxDataPoints = [];
        types = []




        if (chart) {
            chart.options.data[0].dataPoints = chartData;

            chart.render();
        } else {
            initChart();
        }

    } catch (err) {
        console.error("Hiba az adatlekérés során:", err);
    }
}


function formatter(e) {
    if (e.index === 0 && e.dataPoint.x === 0) {
        return " Min " + e.dataPoint.y[e.index] + "°";
    } else if (e.index == 1 && e.dataPoint.x === 0) {
        return " Max " + e.dataPoint.y[e.index] + "°";
    } else {
        return e.dataPoint.y[e.index] + "°";
    }
}



function getIcon(ty) {
    switch (ty) {
        case "eso" || "rainy":
            icon = "cloud-drizzle.svg"
            break
        case "viharos" || "storm":
            icon = "cloud-rain-heavy.svg"
            break
        case "napos" || "sunny":
            icon = "brightness-high.svg"
            break
        case "szeles" || "windy":
            icon = "tropical-storm.svg"
            break
        case "felhos" || "cloudy":
            icon = "cloud.svg"
            break
        case "enyhen felhos" || "cloudy":
            icon = "cloud-sun.svg"




        default:
            break

    }

    return icon

}

