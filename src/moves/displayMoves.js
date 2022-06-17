function displayMoves(){
    let tBody = movesTableTbody
    const movesArray = Object.keys(moves)
    const movesArraySanitized = JSON.stringify(movesArray).replace(/MOVE_|_/ig, "")
    tBody.innerText = ""

    for (let i = 0; i < movesArray.length; i++){
        const moveName = movesArray[i]
        let row = document.createElement("tr")
        tBody.append(row)

        if(i >= 75)
            row.className = "hideTemp"


        let move = document.createElement("td")
        move.className = "move"
        move.innerText = sanitizeString(moves[moveName]["name"])
        row.append(move)







        let typeContainer = document.createElement("td")
        let type = document.createElement("div")
        let hiddenSplit = document.createElement("div")
        typeContainer.className = "type"
        type.className = `${moves[moveName]["type"]} background`
        type.innerText = sanitizeString(moves[moveName]["type"])
        hiddenSplit.innerText = sanitizeString(moves[moveName]["split"])
        hiddenSplit.className = "hide"
        typeContainer.append(type)
        typeContainer.append(hiddenSplit)
        row.append(typeContainer)


        let splitContainer = document.createElement("td")
        let split = document.createElement("div")
        let hiddenType = document.createElement("div")
        let splitIcon = document.createElement("img")
        splitContainer.className = "split"
        split.className = "hide"
        split.innerText = sanitizeString(moves[moveName]["split"])
        hiddenType.innerText = moves[moveName]["type"]
        hiddenType.className = "hide"
        splitIcon.className = `${sanitizeString(moves[moveName]["split"])} splitIcon`
        splitIcon.src = `src/moves/${moves[moveName]["split"]}.png`
        splitContainer.append(split)
        splitContainer.append(hiddenType)
        splitContainer.append(splitIcon)
        row.append(splitContainer)







        const moveObj = moves[moveName]

        row.append(createInputContainer("Power", "power", moveObj))

        row.append(createInputContainer("Acc", "accuracy", moveObj))

        row.append(createInputContainer("PP", "PP", moveObj))








        let effectContainer = document.createElement("td")
        let descriptionContainer = document.createElement("div")


        descriptionContainer.className = "description"
        for(let j = 0; j < moves[moveName]["description"].length; j++){
            let description = document.createElement("div")
            description.innerText += moves[moveName]["description"][j].replace("\\n", " ")
            descriptionContainer.append(description)
        }

        let effect = document.createElement("div")
        effect.className = "effect"
        if(!movesArraySanitized.includes(moves[moveName]["effect"].replace(/EFFECT_|_/ig, "")))
            effect.innerText = `${sanitizeString(moves[moveName]["effect"])}`


        let chance = moves[moveName]["chance"]
        if(chance > 0 && chance < 100)
            effect.innerText += ` ${chance}%`

        effectContainer.append(descriptionContainer)
        if(effect.innerText === "")
            effect.classList.add("hide")
        
        effectContainer.append(effect)

        row.append(effectContainer)

        
    }
}


function createInputContainer(headerText, input, moveObj){
    let inputContainer = document.createElement("td")
    let inputValue = document.createElement("div")
    let inputHeader = document.createElement("div") //only used for mobile view


    inputHeader.innerText = headerText //only used for mobile view
    inputHeader.style.display = "none" //only used for mobile view
    inputHeader.className = "movesHeader" //only used for mobile view

    inputValue.className = `movesBold ${input}` //only used for mobile view

    if(moveObj[input] == 0 || moveObj[input] === undefined)
        inputValue.innerText = "-"
    else
        inputValue.innerText = moveObj[input]

    inputContainer.append(inputHeader)
    inputContainer.append(inputValue)
    inputContainer.className = `${input}Container`

    return inputContainer
}