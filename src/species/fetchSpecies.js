async function getSpecies(species){
    footerP("Fetching species")
    const rawSpecies = await fetch(`https://raw.githubusercontent.com/${repo1}/master/include/constants/species.h`)
    const textSpecies = await rawSpecies.text()

    return regexSpecies(textSpecies, species)
}


async function getBaseStats(species){
    footerP("Fetching base stats")
    const rawBaseStats = await fetch(`https://raw.githubusercontent.com/${repo1}/master/src/base_stats.c`)
    const textBaseStats = await rawBaseStats.text()
    return regexBaseStats(textBaseStats, species)
}

async function getLevelUpLearnsets(species){
    footerP("Fetching level up learnsets")
    const rawLevelUpLearnsets = await fetch(`https://raw.githubusercontent.com/${repo1}/master/src/Tables/level_up_learnsets.c`)
    const textLevelUpLearnsets = await rawLevelUpLearnsets.text()

    const rawLevelUpLearnsetsPointers = await fetch(`https://raw.githubusercontent.com/${repo1}/master/src/Tables/level_up_learnsets.c`)
    const textLevelUpLearnsetsPointers = await rawLevelUpLearnsetsPointers.text()


    const levelUpLearnsetsConversionTable = getLevelUpLearnsetsConversionTable(textLevelUpLearnsetsPointers)


    return regexLevelUpLearnsets(textLevelUpLearnsets, levelUpLearnsetsConversionTable, species)
}

async function getTMHMLearnsets(species){
    footerP("Fetching TMHM learnsets")
    const rawTMHMLearnsets = await fetch(`https://raw.githubusercontent.com/${repo2}/master/src/TM_Tutor_Tables.c`)
    const textTMHMLearnsets = await rawTMHMLearnsets.text()

    return regexTMHMLearnsets(textTMHMLearnsets, species, "gTMHMMoves", "gMoveTutorMoves")
}

async function getTutorLearnsets(species){
    footerP("Fetching tutor learnsets")
    const rawTutorLearnsets = await fetch(`https://raw.githubusercontent.com/${repo2}/master/src/TM_Tutor_Tables.c`)
    const textTutorLearnsets = await rawTutorLearnsets.text()

    return regexTutorLearnsets(textTutorLearnsets, species, "gMoveTutorMoves", "gTMHMMoves")
}

async function getTeachableLearnsets(species){
    const rawTeachableLearnsets = await fetch(`https://raw.githubusercontent.com/${repo1}/master/src/Tables/tm_tutor_new.h`)
    const textTeachableLearnsets = await rawTeachableLearnsets.text()

    return regexTeachableLearnsets(textTeachableLearnsets, species)
}

async function getEvolution(species){
    footerP("Fetching evolution line")
    const rawEvolution = await fetch(`https://raw.githubusercontent.com/${repo2}/master/src/Evolution%20Table.c`)
    const textEvolution = await rawEvolution.text()

    return regexEvolution(textEvolution, species)
}

async function getForms(species){
    footerP("Fetching alternate forms")
    const rawForms = await fetch(`https://raw.githubusercontent.com/${repo}/master/src/data/pokemon/form_species_tables.h`)
    const textForms = await rawForms.text()

    return regexForms(textForms, species)
}

async function getEggMovesLearnsets(species){
    footerP("Fetching egg moves learnsets")
    const rawEggMoves = await fetch(`https://raw.githubusercontent.com/${repo2}/master/src/Egg_Moves.c`)
    const textEggMoves = await rawEggMoves.text()

    return regexEggMovesLearnsets(textEggMoves, species)
}

async function getSprite(species){
    footerP("Fetching sprites")

    const rawSprite = await fetch(`https://raw.githubusercontent.com/${repo2}/master/src/Front_Pic_Table.c`)
    const textSprite = await rawSprite.text()

    return regexSprite(textSprite, species)
}

async function getReplaceAbilities(species){
    const rawReplaceAbilities = await fetch(`https://raw.githubusercontent.com/${repo1}/master/src/Tables/replace_abilities.h`)
    const textReplaceAbilities = await rawReplaceAbilities.text()

    return regexReplaceAbilities(textReplaceAbilities, species)
}

async function getChanges(species, url){
    footerP("Fetching species changes")
    const rawChanges = await fetch(url)
    const textChanges = await rawChanges.text()
    return regexChanges(textChanges, species)
}




async function cleanSpecies(species){
    footerP("Cleaning up...")
    Object.keys(species).forEach(name => {
        if(species[name]["baseSpeed"] <= 0){
            for (let i = 0; i < species[name]["forms"].length; i++){
                const targetSpecies = species[name]["forms"][i]
                for (let j = 0; j < species[targetSpecies]["forms"].length; j++){
                    if(species[targetSpecies]["forms"][j] === name){
                        species[targetSpecies]["forms"].splice(j, 1)
                    }
                }
            }
            for (let i = 0; i < species[name]["evolutionLine"].length; i++){
                const targetSpecies = species[name]["evolutionLine"][i]
                for (let j = 0; j < species[targetSpecies]["evolutionLine"].length; j++){
                    if(species[targetSpecies]["evolutionLine"][j] === name){
                        species[targetSpecies]["evolutionLine"].splice(j, 1)
                    }
                }
            }
        }
        else if(name.match(/_GIGA$/i) && species[name]["evolution"].toString().includes("EVO_MEGA")){
            const replaceName = name.replace(/_GIGA$/i, "_MEGA")
            species[name]["name"] = replaceName
            species[name]["changes"] = []
            species[name]["evolution"] = []
            species[replaceName] = species[name]
            let arraySpeciesToClean = []
            species[name]["forms"].forEach(targetSpecies => {
                if(!arraySpeciesToClean.includes(targetSpecies)){
                    arraySpeciesToClean.push(targetSpecies)
                }
            })
            species[name]["evolutionLine"].forEach(targetSpecies => {
                if(!arraySpeciesToClean.includes(targetSpecies)){
                    arraySpeciesToClean.push(targetSpecies)
                }
            })
            arraySpeciesToClean.forEach(speciesToClean => {
                species[speciesToClean]["forms"] = JSON.parse(JSON.stringify(species[speciesToClean]["forms"]).replaceAll(name, replaceName))
                species[speciesToClean]["evolution"] = JSON.parse(JSON.stringify(species[speciesToClean]["evolution"]).replaceAll(name, replaceName))
                species[speciesToClean]["evolutionLine"] = JSON.parse(JSON.stringify(species[speciesToClean]["evolutionLine"]).replaceAll(name, replaceName))
            })
            species[replaceName] = species[name]
            delete species[name]
        }
        else if(name.match(/_MEGA$|_MEGA_Y$|_MEGA_X$|_GIGA$/i)){
            species[name]["evolution"] = []
        }
    })
    return species
}









async function buildSpeciesObj(){
    let species = {}
    species = await getSpecies(species)
    
    species = await initializeSpeciesObj(species)
    species = await getEvolution(species)
    //species = await getForms(species) // should be called in that order until here    // done in getLevelUpLearnsets for IR
    species = await getBaseStats(species)
    species = await getReplaceAbilities(species)
    species = await getChanges(species, "https://raw.githubusercontent.com/Skeli789/Dynamic-Pokemon-Expansion/master/src/Base_Stats.c")
    species = await getLevelUpLearnsets(species)
    species = await getTMHMLearnsets(species)
    species = await getEggMovesLearnsets(species)
    species = await getTutorLearnsets(species)
    species = await getTeachableLearnsets(species)
    species = await getSprite(species)

    species = await altFormsLearnsets(species, "forms", "tutorLearnsets")
    species = await altFormsLearnsets(species, "forms", "TMHMLearnsets")

    species = await cleanSpecies(species)

    await localStorage.setItem("species", LZString.compressToUTF16(JSON.stringify(species)))
    return species
}


function initializeSpeciesObj(species){
    footerP("Initializing species")
    for (const name of Object.keys(species)){
        species[name]["baseHP"] = 0
        species[name]["baseAttack"] = 0
        species[name]["baseDefense"] = 0
        species[name]["baseSpAttack"] = 0
        species[name]["baseSpDefense"] = 0
        species[name]["baseSpeed"] = 0
        species[name]["BST"] = 0
        species[name]["abilities"] = []
        species[name]["type1"] = ""
        species[name]["type2"] = ""
        species[name]["item1"] = ""
        species[name]["item2"] = ""
        species[name]["eggGroup1"] = ""
        species[name]["eggGroup2"] = ""
        species[name]["changes"] = []
        species[name]["levelUpLearnsets"] = []
        species[name]["TMHMLearnsets"] = []
        species[name]["eggMovesLearnsets"] = []
        species[name]["tutorLearnsets"] = []
        species[name]["evolution"] = []
        species[name]["evolutionLine"] = [name]
        species[name]["forms"] = []
        species[name]["sprite"] = ""
    }
    return species
}


async function fetchSpeciesObj(){
    if(!localStorage.getItem("species"))
        window.species = await buildSpeciesObj()
    else
        window.species = await JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("species")))


    window.sprites = {}
    window.speciesTracker = []

    await Object.keys(species).forEach(async name => {
        if(localStorage.getItem(`${name}`)){
            sprites[name] = await LZString.decompressFromUTF16(localStorage.getItem(`${name}`))
            if(sprites[name].length < 500){
                localStorage.removeItem(name)
                spriteRemoveBgReturnBase64(name, species)
            }
        }
    })
    for(let i = 0, j = Object.keys(species).length; i < j; i++){
        speciesTracker[i] = {}
        speciesTracker[i]["key"] = Object.keys(species)[i]
        speciesTracker[i]["filter"] = []
    }

    tracker = speciesTracker
}

