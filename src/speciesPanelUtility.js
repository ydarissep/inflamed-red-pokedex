const graph = document.getElementById("statsGraph")
const graphStats = [...graph.children]
const statDisplays = [...document.querySelectorAll(".statsGraphHeader")]


const speciesPanelMainContainer = document.getElementById("speciesPanelMainContainer")
const speciesPanelCloseButton = document.getElementById("speciesPanelCloseButton")
const speciesName = document.getElementById("speciesName")
const speciesID = document.getElementById("speciesID")
const speciesSprite = document.getElementById("speciesSprite")
const speciesType1 = document.getElementById("speciesType1")
const speciesType2 = document.getElementById("speciesType2")
const speciesAbilities = document.getElementById("speciesAbilities")
const speciesBaseStatsGraph = document.getElementById("speciesBaseStatsGraph")
const speciesEvolutionsContainer = document.getElementById("speciesEvolutionsContainer")
const speciesEvoMethod = document.getElementById("speciesEvoMethod")
const speciesFormes = document.getElementById("speciesFormes")
const speciesFormesText = document.getElementById("speciesFormesText")
const speciesEggGroups = document.getElementById("speciesEggGroups")
const speciesHeldItems = document.getElementById("speciesHeldItems")
const speciesChanges = document.getElementById("speciesChanges")
const speciesHeldItemsContainer = document.getElementById("speciesHeldItemsContainer")
const speciesChangesContainer = document.getElementById("speciesChangesContainer")
const speciesPanelLevelUpTableTbody = document.getElementById("speciesPanelLevelUpTableTbody")
const speciesPanelTMHMTableTbody = document.getElementById("speciesPanelTMHMTableTbody")
const speciesPanelTutorTableTbody = document.getElementById("speciesPanelTutorTableTbody")
const speciesPanelEggMovesTableTbody = document.getElementById("speciesPanelEggMovesTableTbody")


async function createSpeciesPanel(name){
    panelSpecies = name
    speciesPanelMainContainer.classList.remove("hide")

    const row = document.getElementById(`${name}`)

    speciesName.innerText = row.getElementsByClassName("species")[0].innerText
    speciesID.innerText = `#${species[name]["ID"]}`

    speciesSprite.src = getSpeciesSpriteSrc(name)

    speciesType1.innerText = sanitizeString(species[name]["type1"])
    speciesType2.innerText = sanitizeString(species[name]["type2"])
    speciesType1.className = `${species[name]["type1"]} background`
    speciesType2.className = `${species[name]["type2"]} background`

    if(speciesType1.innerText === speciesType2.innerText)
        speciesType2.classList.add("hide")
    else
        speciesType2.classList.remove("hide")






    while (speciesAbilities.firstChild)
        speciesAbilities.removeChild(speciesAbilities.firstChild)

    let abilitiesArray = []

    for (let i = 0; i < species[name]["abilities"].length; i++){
        if(species[name]["abilities"][i] !== "ABILITY_NONE" 
        && !abilitiesArray.includes(species[name]["abilities"][i]))
            abilitiesArray.push(species[name]["abilities"][i])
    }

    for (let i = 0; i < abilitiesArray.length; i++){
        const abilityContainer = document.createElement("div")
        const abilityName = document.createElement("span")
        const abilityDescription = document.createElement("span")

        abilityName.innerText = `${abilities[abilitiesArray[i]]["ingameName"]}`
        abilityDescription.innerText = abilities[abilitiesArray[i]]["description"]

        if(i === abilitiesArray.length - 1 && i > 0)
            abilityName.className = "bold"
        else
            abilityName.className = "italic"
        abilityDescription.className = "speciesPanelAbilitiesDescriptionPadding"
        abilityContainer.className = "flex wrap"

        abilityContainer.append(abilityName)
        abilityContainer.append(abilityDescription)
        speciesAbilities.append(abilityContainer)
    }







    let monStats = [species[name]["baseHP"],
    species[name]["baseAttack"], 
    species[name]["baseDefense"], 
    species[name]["baseSpAttack"], 
    species[name]["baseSpDefense"], 
    species[name]["baseSpeed"],
    species[name]["BST"]]

    
    graphStats.forEach ((stat, index) => {
        statDisplays[index].innerText = monStats[index]

        if(index !== 6){
            stat.style.width = `${(monStats[index] / 255) * graph.offsetWidth}px`
            stat.style.background = `hsl(${monStats[index]*0.7},85%,45%)`
        }
        else{
            stat.style.width = `${(monStats[index] / 255) * graph.offsetWidth/6}px`
            stat.style.background = `hsl(${(monStats[index]*1)/6},85%,45%)`   
        }
    })



    while (speciesEvolutionsContainer.firstChild) 
        speciesEvolutionsContainer.removeChild(speciesEvolutionsContainer.firstChild);
    while (speciesEvoMethod.firstChild)
        speciesEvoMethod.removeChild(speciesEvoMethod.firstChild)

    if(species[name]["evolutionLine"].length > 1){
        for (let i = 0; i < species[name]["evolutionLine"].length; i++){
            speciesEvolutionsContainer.append(createClickableImgAndName(species[name]["evolutionLine"][i]))
        }
    }

    if(species[name]["evolution"].length === 0){
        const evoMethod = document.createElement("div")
        evoMethod.innerText = "Does not evolve"
        evoMethod.className = "italic"
        speciesEvoMethod.append(evoMethod)
    }
    else{
        for (let i = 0; i < species[name]["evolution"].length; i++){
            const evoMethod = document.createElement("div")
            const sprite = document.createElement("img")
            evoMethod.innerText = `${sanitizeString(species[name]["evolution"][i][0])} (${sanitizeString(species[name]["evolution"][i][1])}) ➝ ${sanitizeString(species[name]["evolution"][i][2])}`
            sprite.src = getSpeciesSpriteSrc(species[name]["evolution"][i][2])
            sprite.className = "miniSprite2"
            evoMethod.className = "evoMethod"
            evoMethod.append(sprite)

            evoMethod.addEventListener("click", () => {
                createSpeciesPanel(species[name]["evolution"][i][2])
            })

            speciesEvoMethod.append(evoMethod)
        }
    }


    while (speciesFormes.firstChild)
        speciesFormes.removeChild(speciesFormes.firstChild)


    if(species[name]["forms"].length === 0)
        speciesFormesText.classList.add("hide")
    else
        speciesFormesText.classList.remove("hide")

    if(species[name]["forms"].length > 1){
        for (let i = 0; i < species[name]["forms"].length; i++){
            speciesFormes.append(createClickableImgAndName(species[name]["forms"][i]))
        }
    }



















    while (speciesEggGroups.firstChild) 
        speciesEggGroups.removeChild(speciesEggGroups.firstChild);
    while (speciesHeldItems.firstChild)
        speciesHeldItems.removeChild(speciesHeldItems.firstChild)
    while (speciesChanges.firstChild)
        speciesChanges.removeChild(speciesChanges.firstChild)




    const eggGroup1 = document.createElement("div")
    const eggGroup2 = document.createElement("div")
    eggGroup1.innerText = sanitizeString(species[name]["eggGroup1"])
    eggGroup2.innerText = sanitizeString(species[name]["eggGroup2"])
    speciesEggGroups.append(eggGroup1)
    if(species[name]["eggGroup1"] !== species[name]["eggGroup2"])
        speciesEggGroups.append(eggGroup2)





    if(species[name]["item1"] !== "ITEM_NONE"){
        const heldItem1 = document.createElement("div")
        heldItem1.innerText = `50% ${sanitizeString(species[name]["item1"])}`
        speciesHeldItems.append(heldItem1)
    }
    if(species[name]["item2"] !== "ITEM_NONE"){
        const heldItem2 = document.createElement("div")
        heldItem2.innerText = `5% ${sanitizeString(species[name]["item2"])}`
        speciesHeldItems.append(heldItem2)
    }

    if(speciesHeldItems.firstChild)
        speciesHeldItemsContainer.classList.remove("hide")
    else
        speciesHeldItemsContainer.classList.add("hide")







    if(species[name]["changes"].length !== 0){
        for (let i = 0; i < species[name]["changes"].length; i++){
            const stat = species[name]["changes"][i][0]
            const oldStat = species[name]["changes"][i][1]
            const newStat = species[name][stat]
            createChange(stat, oldStat, newStat, name)
        }
    }
    if(speciesChanges.firstChild)
        speciesChangesContainer.classList.remove("hide")
    else
        speciesChangesContainer.classList.add("hide")












    while(speciesPanelLevelUpTableTbody.firstChild)
        speciesPanelLevelUpTableTbody.removeChild(speciesPanelLevelUpTableTbody.firstChild)
    buildSpeciesPanelLearnsetsTable(speciesPanelLevelUpTableTbody, name, "levelUpLearnsets")

    while(speciesPanelTMHMTableTbody.firstChild)
        speciesPanelTMHMTableTbody.removeChild(speciesPanelTMHMTableTbody.firstChild)
    buildSpeciesPanelLearnsetsTable(speciesPanelTMHMTableTbody, name, "TMHMLearnsets")

    while(speciesPanelTutorTableTbody.firstChild)
        speciesPanelTutorTableTbody.removeChild(speciesPanelTutorTableTbody.firstChild)
    buildSpeciesPanelLearnsetsTable(speciesPanelTutorTableTbody, name, "tutorLearnsets")

    while(speciesPanelEggMovesTableTbody.firstChild)
        speciesPanelEggMovesTableTbody.removeChild(speciesPanelEggMovesTableTbody.firstChild)
    buildSpeciesPanelEggMovesTable(speciesPanelEggMovesTableTbody, name, "eggMovesLearnsets")

}






function getSpeciesSpriteSrc(speciesName){
    const row = document.getElementById(`${speciesName}`)
    
    if(row.getElementsByClassName("src")[0].src !== undefined)
        return row.getElementsByClassName("src")[0].src
    else if(row.getElementsByClassName("src")[0].toDataURL() !== undefined)
        return row.getElementsByClassName("src")[0].toDataURL()
    else
        return species[speciesName]["sprite"]
}



function createClickableImgAndName(speciesName){
    const container = document.createElement("div")
    const sprite = document.createElement("img")
    const name = document.createElement("span")

    container.className = "flexCenter flex flexRow hover"

    sprite.src = getSpeciesSpriteSrc(speciesName)
    sprite.className = "miniSprite"

    name.innerText = sanitizeString(species[speciesName]["name"])
    name.className = "underline"


    container.append(sprite)
    container.append(name)

    container.addEventListener("click", () => {
        createSpeciesPanel(speciesName)
    })

    return container
}








function createChange(stat, oldStat = [""], newStat = [""], speciesName){

    if(typeof newStat == "object"){
        for (let i = 0; i < newStat.length; i++){


            const changeMainContainer = document.createElement("div")
            const changeContainer = document.createElement("span")
            const statContainer = document.createElement("span")

            const oldStatContainer = document.createElement("span")
            const newStatContainer = document.createElement("span")

            statContainer.innerText = replaceStatString(stat)


            if(newStat[i] !== oldStat[i]){
                if(newStat.includes(oldStat[i]) && !oldStat.includes(newStat[i])){ // purely a buff
                    newStatContainer.innerText = `${sanitizeString(newStat[i])}`
                    changeContainer.classList.add("buff")
                    appendChangesToMainContainer(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer)   
                }
                else if(!oldStat.includes(newStat[i])){ // neutral
                    oldStatContainer.innerText = `${sanitizeString(oldStat[i])}`
                    newStatContainer.innerText = `${sanitizeString(newStat[i])}`
                    appendChangesToMainContainer(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer)
                }
                else if(!newStat.includes(oldStat[i])){ // purely a nerf
                    oldStatContainer.innerText = `${sanitizeString(oldStat[i])}`
                    changeContainer.classList.add("nerf")
                    appendChangesToMainContainer(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer)   
                }
            }


        }
    }
    else if(newStat !== oldStat){


        const changeMainContainer = document.createElement("div")
        const changeContainer = document.createElement("span")
        const statContainer = document.createElement("span")

        const oldStatContainer = document.createElement("span")
        const newStatContainer = document.createElement("span")

        statContainer.innerText = replaceStatString(stat)


        oldStatContainer.innerText = `${sanitizeString(oldStat)}`
        newStatContainer.innerText = `${sanitizeString(newStat)}`
        if(!isNaN(newStat)){
            if(newStat > oldStat){
                changeContainer.classList.add("buff")
            }
            else{
                changeContainer.classList.add("nerf")
            }
        }
        else if(stat === "type1" || stat === "type2"){
            oldStatContainer.className = `${oldStat} backgroundChange`
            newStatContainer.className = `${newStat} backgroundChange`
            if(oldStat === species[speciesName]["type1"] || oldStat === species[speciesName]["type2"]){
                oldStatContainer.innerText = ""
                oldStatContainer.className = ""
            }
        }
        appendChangesToMainContainer(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer)   
    }
}



function appendChangesToMainContainer(changeMainContainer, statContainer, changeContainer, oldStatContainer, newStatContainer){
    changeMainContainer.className = "flex flexAlign"
    changeContainer.classList.add("textAlign")
    changeContainer.classList.add("changeTextAlignFlex")
    statContainer.classList.add("speciesPanelStatPadding")
    oldStatContainer.classList.add("reduceOpacity")
    newStatContainer.classList.add("bold")

    const changeContainerTransition = document.createElement("span")
    changeContainerTransition.innerText = " ➝ "

    changeContainer.append(oldStatContainer, changeContainerTransition, newStatContainer)

    changeMainContainer.append(statContainer, changeContainer)
    speciesChanges.append(changeMainContainer)
}







function replaceStatString(stat){
    const replaceStringObject = {
        "type1": "Type",
        "type2": "Type",
        "eggGroup1": "Egg Group",
        "eggGroup2": "Egg Group",
        "abilities": "Ability",
        "baseHP": "HP",
        "baseAttack": "Atk",
        "baseDefense": "Def",
        "baseSpAttack": "SpA",
        "baseSpDefense": "SpD",
        "baseSpeed": "Spe",
    }
    if(stat in replaceStringObject){
        return replaceStringObject[stat]
    }
    else{
        return stat
    }
}



















function buildSpeciesPanelLearnsetsTable(Tbody, name, input){
    for (let i = 0; i < species[name][input].length; i++){
        const row = document.createElement("tr")

        const level = document.createElement("td")
        level.innerText = species[name][input][i][1]
        row.append(level)

        const moveName = document.createElement("td")
        moveName.innerText = moves[species[name][input][i][0]]["ingameName"]
        moveName.className = "bold"
        row.append(moveName)

        const typeContainer = document.createElement("td")
        const type = document.createElement("div")
        type.innerText = sanitizeString(moves[species[name][input][i][0]]["type"])
        type.className = `${moves[species[name][input][i][0]]["type"]} background`
        typeContainer.append(type)
        row.append(typeContainer)

        const splitContainer = document.createElement("td")
        const splitIcon = document.createElement("img")
        splitIcon.src = `src/moves/${moves[species[name][input][i][0]]["split"]}.png`
        splitIcon.className = `${sanitizeString(moves[species[name][input][i][0]]["split"])} splitIcon`
        splitContainer.append(splitIcon)
        row.append(splitContainer)

        const power = document.createElement("td")
        power.className = "speciesPanelLearnsetsPower"
        if(moves[species[name][input][i][0]]["power"] != 0){
            power.innerText = moves[species[name][input][i][0]]["power"]
        }
        else{
            power.innerText = "-"   
        }
        row.append(power)

        const accuracy = document.createElement("td")
        accuracy.className = "speciesPanelLearnsetsAccuracy"
        if(moves[species[name][input][i][0]]["accuracy"] != 0){
            accuracy.innerText = moves[species[name][input][i][0]]["accuracy"]
        }
        else{
            accuracy.innerText = "-"   
        }
        row.append(accuracy)

        const PP = document.createElement("td")
        PP.className = "speciesPanelLearnsetsPP"
        PP.innerText = moves[species[name][input][i][0]]["PP"]
        row.append(PP)

        const description = document.createElement("td")
        description.className = "speciesPanelLearnsetsEffect"
        for (let j = 0; j < moves[species[name][input][i][0]]["description"].length; j++){
            description.innerText += moves[species[name][input][i][0]]["description"][j].replace(/\\n/gi, " ").replace(/\\/g, "")
        }
        row.append(description)

        Tbody.append(row)
    }
}


function buildSpeciesPanelEggMovesTable(Tbody, name, input){
    for (let i = 0; i < species[name][input].length; i++){
        const row = document.createElement("tr")

        const moveName = document.createElement("td")
        moveName.innerText = moves[species[name][input][i]]["ingameName"]
        moveName.className = "bold"
        row.append(moveName)

        const typeContainer = document.createElement("td")
        const type = document.createElement("div")
        type.innerText = sanitizeString(moves[species[name][input][i]]["type"])
        type.className = `${moves[species[name][input][i]]["type"]} background`
        typeContainer.append(type)
        row.append(typeContainer)

        const splitContainer = document.createElement("td")
        const splitIcon = document.createElement("img")
        splitIcon.src = `src/moves/${moves[species[name][input][i]]["split"]}.png`
        splitIcon.className = `${sanitizeString(moves[species[name][input][i]]["split"])} splitIcon`
        splitContainer.append(splitIcon)
        row.append(splitContainer)

        const power = document.createElement("td")
        power.className = "speciesPanelLearnsetsPower"
        if(moves[species[name][input][i]]["power"] != 0){
            power.innerText = moves[species[name][input][i]]["power"]
        }
        else{
            power.innerText = "-"   
        }
        row.append(power)

        const accuracy = document.createElement("td")
        accuracy.className = "speciesPanelLearnsetsAccuracy"
        if(moves[species[name][input][i]]["accuracy"] != 0){
            accuracy.innerText = moves[species[name][input][i]]["accuracy"]
        }
        else{
            accuracy.innerText = "-"   
        }
        row.append(accuracy)

        const PP = document.createElement("td")
        PP.className = "speciesPanelLearnsetsPP"
        PP.innerText = moves[species[name][input][i]]["PP"]
        row.append(PP)

        const description = document.createElement("td")
        description.className = "speciesPanelLearnsetsEffect"
        for (let j = 0; j < moves[species[name][input][i]]["description"].length; j++){
            description.innerText += moves[species[name][input][i]]["description"][j].replace(/\\n/gi, " ").replace(/\\/g, "")
        }
        row.append(description)

        Tbody.append(row)
    }
}





speciesPanelCloseButton.addEventListener("click", () => {
        speciesPanelMainContainer.classList.add("hide")
})

