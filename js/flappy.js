window.onkeydown = e =>{
    if(e.keyCode == 82){
        window.location.reload()
    }
}


const passaro = document.querySelector('[wm-flappy]')
const conteudo = document.querySelector('.conteudo.flex')
const pontos = document.querySelector('[pontos]')
const moldeParede = document.querySelector('.parede.flex')
const aviso = document.querySelector('[aviso-inicial]')

const cabeOutraParede = 800

const mainInicio = conteudo.getBoundingClientRect().width

const mainFim = -(moldeParede.clientWidth * 2)

let passouLimite = false

let topLimit = 1000
let botLimit = 0

let iniciado = false


function mudaImgFundo(checkBox) {
    if (checkBox.checked) {
        conteudo.style.backgroundImage = 'url("G:/Meus(lucas)/Web moderno/dom/imgs/fundo2.jpg")'
    } else {
        conteudo.style.backgroundImage = 'url("G:/Meus(lucas)/Web moderno/dom/imgs/fundo1.jpg")'
    }
}

const perdeu = () => {

    passaro.style.backgroundImage = 'url("G:/Meus(lucas)/Web moderno/dom/imgs/passaro-morto.png")'

    aviso.style.display = 'flex'
    const divResultado = aviso.firstElementChild
    divResultado.innerHTML += `<p> Você perdeu, mas fez ${pontos.textContent} pontos(s) : )`

    console.log(`Perdeu :'(
Você fez ${pontos.textContent} ponto(s)`)

}

const garbageColector = () => {
    conteudo.removeChild(moldeParede.previousElementSibling)
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;

}


function paredeFactory(nextElement = moldeParede) {

    const novoClone = moldeParede.cloneNode(true)

    const randomHeightTop = randomNumber(60, 500)

    novoClone.firstElementChild.style.height = `${randomHeightTop}px`

    const randomHeightBot = 560 - randomHeightTop

    novoClone.lastElementChild.style.height = `${randomHeightBot}px`

    novoClone.style.left = `${mainInicio}px`

    conteudo.insertBefore(novoClone, nextElement)

    return novoClone
}


function moverParede(parede, inicio, fim, passo, callback) {

    if (passouLimite) {
        return
    }

    let proxParede = parede.previousElementSibling ? parede.previousElementSibling : null

    const novoInicio = inicio - passo

    if (novoInicio <= 585 && novoInicio >= 430) {
        botLimit = Number.parseFloat(parede.lastElementChild.style.height)
        topLimit = botLimit + 90

    }

    if (proxParede) {
        let posicaoProxParede = Number.parseInt(proxParede.style.left)
        if (posicaoProxParede === 729) {
            pontos.textContent = Number.parseInt(pontos.textContent) + 1
            botLimit = 0
            topLimit = 1000
        }
    }


    if (novoInicio === cabeOutraParede) {
        const outroClone = paredeFactory(parede)
        moverParede(outroClone, mainInicio, mainFim, 1, garbageColector)
    }

    if (novoInicio >= fim) {
        parede.style.left = `${novoInicio}px`
        setTimeout(() => moverParede(parede, novoInicio, fim, passo, callback), 10)
    } else {
        callback()
    }
}


window.onkeyup = e => {
    if (e.keyCode == 13 && !iniciado) {
        iniciado = true;

        aviso.style.display = 'none';

        const clone = paredeFactory()
        moverParede(clone, mainInicio, mainFim, 1, garbageColector)

        let alturaAtualPassaro = 325

        const verificaLimite = setInterval(function () {
            if (alturaAtualPassaro <= botLimit || alturaAtualPassaro >= topLimit) {
                passouLimite = true
                perdeu()
                clearInterval(verificaLimite)
            } else {
                passouLimite = false
            }
        }, 1)


        let gravidade = setInterval(function () {
            alturaAtualPassaro -= 2
            if (passouLimite) {
                clearInterval(gravidade)
                return
            }
            alturaAtualPassaro = alturaAtualPassaro <= 0 ? 0 : alturaAtualPassaro

            passaro.style.bottom = `${alturaAtualPassaro}px`
        }, 10)

        window.onkeypress = e => {
            if (passouLimite) {
                return
            }

            alturaAtualPassaro += 50
            alturaAtualPassaro = alturaAtualPassaro >= 650 ? 650 : alturaAtualPassaro

            passaro.style.bottom = `${alturaAtualPassaro}px`
        }

    }
}




