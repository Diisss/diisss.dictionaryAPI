let state = {
    word:"",
    meanings: [],
    phonetics: [],
}
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
const input = document.getElementById("word-input")
const form = document.querySelector(".form")
const containerWord = document.querySelector(".results-word")
const soundButton = document.querySelector(".results-sound")
const resultslist = document.querySelector(".results-list")
const resultWrapper = document.querySelector(".results")
const errorContainer = document.querySelector(".error")

const showError = (error) => {
    errorContainer.style.display = "block"
    resultWrapper.style.display = "none"

    errorContainer.innerText = error.message
}

const renderDefinition = (itemDefinition) => {
    const example = itemDefinition.example
    ? `<div class="results item__example">
        <p>Example: <span>${itemDefinition.example}</span></p></div>`
    : ""

    return `<div class="results-item__definition">
                <p>${itemDefinition.definition}</p>
                ${example}
            </div>`
}

const getDefinition = (definitions) => {
    return definitions.map(renderDefinition).join("")
}

const renderItem = (item) => {
    return `<div class="reults-item">
                    <div class="results-item__part">
                        ${item.partOfSpeech}
                    </div>
                <div class="results-item__definitions">
                    ${getDefinition(item.definitions)}
                </div>
            </div>`
}

const showResults = () => {
    resultWrapper.style.display = "block"
    resultslist.innerHTML = ""
    state.meanings.forEach((item) => resultslist.innerHTML += renderItem(item))
}

const inserWord = () => {
    containerWord.innerText = state.word
}

const handleSubmit = async (event) => {
    event.preventDefault()

    errorContainer.style.display = "none"
    
    if (!state.word.trim()) return
    try {
        const response = await fetch(`${url}${state.word}`)
        const data = await response.json()
        
        if(response.ok && data.length) {
            const item = data[0]

            state = {
                ...state,
                meanings: item.meanings,
                phonetics: item.phonetics,
            }
            inserWord()
            showResults()
        } else {
            showError(data)
        }
    } catch (err) {
        console.log(err)
    }
}

const handleKeyup = (event) => {
    const value = event.target.value
    state.word = value
}

const handleSound = () => {
    if(state.phonetics.length) {
        const sound = state.phonetics[0]
        if (sound.audio) {
            new Audio(sound.audio).play()
    }
    }
}

input.addEventListener("keyup", handleKeyup)
form.addEventListener("submit", handleSubmit)
soundButton.addEventListener("click", handleSound)