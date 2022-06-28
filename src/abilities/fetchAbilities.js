async function getAbilities(abilities){
    footerP("Fetching abilities")
    const rawAbilities = await fetch(`https://raw.githubusercontent.com/${repo1}/master/include/constants/abilities.h`)
    const textAbilities = await rawAbilities.text()

    return regexAbilities(textAbilities, abilities)
}


async function getVanillaAbilitiesDescription(abilities){
    const rawVanillaAbilitiesDescription = await fetch("https://raw.githubusercontent.com/Greenphx9/pokefirered/master/src/data/text/abilities.h")
    const textVanillaAbilitiesDescription = await rawVanillaAbilitiesDescription.text()

    return regexVanillaAbilitiesDescription(textVanillaAbilitiesDescription, abilities)
}

async function getAbilitiesIngameName(abilities){
    footerP("Fetching abilities ingame name")
    const rawAbilitiesIngameName = await fetch(`https://raw.githubusercontent.com/${repo1}/master/strings/ability_name_table.string`)
    const textAbilitiesIngameName = await rawAbilitiesIngameName.text()

    return regexAbilitiesIngameName(textAbilitiesIngameName, abilities)
}

async function getAbilitiesDescription(abilities){
    footerP("Fetching abilities description")
    const rawAbilitiesDescription = await fetch(`https://raw.githubusercontent.com/${repo1}/master/strings/ability_descriptions.string`)
    const textAbilitiesDescription = await rawAbilitiesDescription.text()

    return regexAbilitiesDescription(textAbilitiesDescription, abilities)
}

async function buildAbilitiesObj(){
    let abilities = {}
    abilities = await getAbilities(abilities) 
    abilities = await getVanillaAbilitiesDescription(abilities)
    abilities = await getAbilitiesIngameName(abilities)
    abilities = await getAbilitiesDescription(abilities)
    abilities["ABILITY_NEUTRALIZINGGAS"]["description"] = "All Abilities are nullified."
    abilities["ABILITY_WANDERING_SPIRIT"]["description"] = "Trades Abilities on contact."
    abilities["ABILITY_PERISH_BODY"]["description"] = "Gives a perish count on contact."
    abilities["ABILITY_STEELY_SPIRIT"]["description"] = "Boosts ally Steel moves."
    abilities["ABILITY_GULPMISSLE"]["description"] = "Spits prey if damaged after a swim."
    delete abilities["ABILITY_NONE"]
    delete abilities["ABILITY_NAME_LENGTH"]
    delete abilities["ABILITY_NAMELENGTH"]

    await localStorage.setItem("abilities", LZString.compressToUTF16(JSON.stringify(abilities)))
    return abilities
}


async function fetchAbilitiesObj(){
    if(!localStorage.getItem("abilities"))
        window.abilities = await buildAbilitiesObj()
    else
        window.abilities = await JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("abilities")))
    
    await displayAbilities()
}