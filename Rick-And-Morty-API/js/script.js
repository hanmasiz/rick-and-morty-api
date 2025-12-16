const divCards = document.querySelector(".cards")
const btn = document.querySelector("#btn")
const langToggle = document.querySelector("#lang-toggle")
let pagina = 1
let maxPage = null
let currentLang = 'pt' // 'pt' or 'en'

const translations = {
    pt: {
        'lang.toggle': 'English',
        'hero.title': 'Todos personagens em um só <span>lugar.</span>',
        'hero.description': 'Esta documentação ajudará você a se familiarizar com os recursos da API de Rick e Morty e mostrará como fazer diferentes consultas para que você possa aproveitá-la ao máximo',
        'hero.link': 'link documentação',
        'hero.exclaim': 'Ai sim, Porr#@%&*',
        'characters.title': 'Personagens',
        'load_more': 'carregar mais'
    },
    en: {
        'lang.toggle': 'Português',
        'hero.title': 'All characters in one <span>place.</span>',
        'hero.description': 'This documentation will help you get familiar with the Rick and Morty API features and show how to make different queries so you can get the most out of it.',
        'hero.link': 'docs link',
        'hero.exclaim': 'Oh yeah, Hell yeah!',
        'characters.title': 'Characters',
        'load_more': 'load more'
    }
}

function applyTranslations(lang){
    document.documentElement.lang = (lang === 'en') ? 'en' : 'pt-br'
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n
        const value = translations[lang] && translations[lang][key]
        if(value !== undefined){
            el.innerHTML = value
        }
    })
    if(langToggle) langToggle.textContent = translations[lang]['lang.toggle']
}

function localizeValue(type, value){
    if(!value) return value
    if(currentLang === 'pt'){
        if(type === 'status'){
            if(value === 'Alive') return 'Vivo'
            if(value === 'Dead') return 'Morto'
            if(value.toLowerCase() === 'unknown') return 'Desconhecido'
        }
        if(type === 'species'){
            if(value === 'Human') return 'Humano'
        }
    }
    return value
}

async function apresentaPersonagens (){
    const response= await fetch(`https://rickandmortyapi.com/api/character/?page=${pagina}`)
    const data = await response.json()

    maxPage = data.info.pages
    data.results.forEach((personagem)=>{
        const divCard = document.createElement("div")
        divCard.classList.add("card")

        const statusText = localizeValue('status', personagem.status)
        const speciesText = localizeValue('species', personagem.species)
        const originText = personagem.origin && personagem.origin.name ? personagem.origin.name : ''

        divCard.innerHTML = ` 
                <header>
                    <img src="${personagem.image}" alt="${personagem.name}">
                    <p>${personagem.name}</p>
                </header>
                <div class="content">
                    <div class="status">
                        <img src="./img/status.svg" alt="">
                        <p>${statusText}</p>
                    </div>
                    <div class="status">
                        <img src="./img/status-02.svg" alt="">
                        <p>${speciesText}</p>
                    </div>
                    <div class="status">
                        <img src="./img/status-03.svg" alt="">
                        <p>${originText}</p>
                    </div>
                </div>` 
                divCards.appendChild(divCard)
    })

    if(pagina >= maxPage){
        btn.setAttribute("hidden","")
    } else {
        btn.removeAttribute("hidden")
    }

}

function carregarMais() {
    if(maxPage && pagina >= maxPage){
        btn.setAttribute("hidden","")
        return
    }
    pagina++
    apresentaPersonagens()
}

btn.addEventListener("click",carregarMais)

if(langToggle){
    langToggle.addEventListener('click', ()=>{
        currentLang = currentLang === 'pt' ? 'en' : 'pt'
        // re-render from first page to update localized status/species
        pagina = 1
        divCards.innerHTML = ''
        applyTranslations(currentLang)
        apresentaPersonagens()
    })
}

applyTranslations(currentLang)
apresentaPersonagens()