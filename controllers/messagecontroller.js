

function Messages(severity, title, message) {
    let msgBox = document.getElementById('msgBox')
    msgBox.innerHTML = ''
    msgBox.className = ''

    let h3 = document.createElement('h3')
    let p = document.createElement('p')
    let closeBTN = document.createElement('button')

    h3.innerHTML = title
    p.innerHTML = message
    closeBTN.classList.add('btn-close')
    closeBTN.setAttribute('data-bs-dismiss', 'alert')
    closeBTN.setAttribute('aria-labe', 'Close')
    msgBox.classList.add('alert', `alert-${severity}`, 'alert-dismissible', 'fade', 'show')

    msgBox.appendChild(h3)
    msgBox.appendChild(p)
    msgBox.appendChild(closeBTN)


    setTimeout(() => {
        msgBox.classList.add('d-none')
    }, 3000);
}
