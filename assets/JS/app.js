let main = document.getElementById('mainDiv')


async function Render(view) {
    main.innerHTML = await (await fetch(`views/${view}.html`)).text()


    switch (view) {
        case 'logout':
            logout()
            break;
        
        case 'profile':
            profileDataFill()
            break;
    
        case 'statistics':
            getChartData()
            initChart()
        default:
            break;
    }
    


}


//Theme variations
function loadTheme() {
    let lastTheme = localStorage.getItem('theme') ? localStorage.getItem('theme'): 'dark'
        setTheme(lastTheme)

    }


function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme)

}

function saveTheme(theme) {
    localStorage.setItem('theme', theme)

}

document.getElementById('lightTheme').addEventListener('click', () =>
    {
        saveTheme('light')
        setTheme('light')

    })
document.getElementById('darkTheme').addEventListener('click', () => 
    {
        saveTheme('dark')
        setTheme('dark')
    })

loadTheme()
