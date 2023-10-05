function regexMovesDescription(textMovesDescription, moves){
    const lines = textMovesDescription.split("\n")
    let move = []

    lines.forEach(line => {
        const matchDesc = line.match(/DESC_\w+/i)
        if(matchDesc){
            const descToMove = matchDesc[0].replace("DESC_", "MOVE_")
            if(moves[descToMove] !== undefined)
                move.push(descToMove)
            if(moves[`${descToMove}_S`] !== undefined)
                move.push(`${descToMove}_S`)
            if(moves[`${descToMove}_P`] !== undefined)
                move.push(`${descToMove}_P`)


            const sanitizedMove = descToMove.replace(/_/g, "").replace("MOVE", "MOVE_")
            if(moves[sanitizedMove] !== undefined && sanitizedMove !== descToMove)
                move.push(sanitizedMove)

        }
        else{
            if(line.length < 10)
                move = []
            else if(move.length > 0){
                for(let i = 0; i < move.length; i++)
                    moves[move[i]]["description"] = [line.replace(/\\n/g, " ")]
            }
        }
    })

    return moves
}


function regexMoves(textMoves, moves){
    const lines = textMoves.split("\n")
    let move = null, change = false, rebalanced = false

    lines.forEach(line => {
        const matchMoves = line.match(/\[ *(MOVE_\w+) *\]/i)
        if(matchMoves){
            move = matchMoves[1]
            if(moves[move] === undefined){
                moves[move] = {}
                moves[move]["name"] = move
                moves[move]["changes"] = []
                moves[move]["description"] = []
                moves[move]["ingameName"] = sanitizeString(move)
            }
            else{ // assuming dynamax power
                const matchMaxPower = line.match(/\d+/)
                if(matchMaxPower){
                   const maxPower = matchMaxPower[0]
                   moves[move] = setMove(moves[move], change, "maxPower", maxPower)
                }
            }
        }
        if(line.includes("#ifdef")){
            rebalanced = true
        }
        else if(line.includes("else") && rebalanced === true){
            rebalanced = false
            change = true
        }
        else if(line.includes("endif") && change === true)
            change = false


        if(line.includes(".power")){
            const matchPower = line.match(/\d+/)
            if(matchPower){
                const power = matchPower[0]

                moves[move] = setMove(moves[move], change, "power", power)
            }
        }
        else if(line.includes(".pp")){
            const matchPP = line.match(/\d+/)
            if(matchPP){
                const PP = matchPP[0]

                moves[move] = setMove(moves[move], change, "PP", PP)
            }
        }
        else if(line.includes(".type")){
            const matchType = line.match(/TYPE_\w+/i)
            if(matchType){
                const type = matchType[0]

                moves[move] = setMove(moves[move], change, "type", type)
            }
        }
        else if(line.includes(".accuracy")){
            const matchAccuracy = line.match(/\d+/)
            if(matchAccuracy){
                const accuracy = matchAccuracy[0]

                moves[move] = setMove(moves[move], change, "accuracy", accuracy)
            }
        }
        else if(line.includes(".split")){
            const matchSplit = line.match(/SPLIT_\w+/i)
            if(matchSplit){
                const split = matchSplit[0]

                moves[move] = setMove(moves[move], change, "split", split)
            }
        }
        else if(line.includes(".effect")){
            const matchEffect = line.match(/EFFECT_\w+/i)
            if(matchEffect){
                const effect = matchEffect[0]

                moves[move] = setMove(moves[move], change, "effect", effect)
            }
        }
        else if(line.includes(".secondaryEffectChance")){
            const matchChance = line.match(/\d+/)
            if(matchChance){
                const chance = matchChance[0]

                moves[move] = setMove(moves[move], change, "chance", chance)
            }
        }
        else if(line.includes(".target")){
            const matchTarget = line.match(/MOVE_TARGET_\w+/i)
            if(matchTarget){
                const target = matchTarget[0]

                moves[move] = setMove(moves[move], change, "target", target)
            }
        }
        else if(line.includes(".flags")){
            const matchFlags = line.match(/FLAG_\w+/ig)
            if(matchFlags){
                const flags = matchFlags

                moves[move] = setMove(moves[move], change, "flags", flags)
            }
        }
        else if(line.includes(".priority")){
            const matchPriority = line.match(/-?\d+/)
            if(matchPriority){
                let priority = matchPriority[0]
                if(priority >= 50)
                    priority -= 256

                moves[move] = setMove(moves[move], change, "priority", `${priority}`)
            }
        }
        else if(line.includes(".z_move_power")){
            const matchZpower = line.match(/\d+/)
            if(matchZpower){
                const Zpower = matchZpower[0]

                moves[move] = setMove(moves[move], change, "Zpower", Zpower)
            }
        }
        else if(line.includes(".z_move_effect")){
            const matchZeffect = line.match(/Z_EFFECT_\w+/i)
            if(matchZeffect){
                const Zeffect = matchZeffect[0]

                moves[move] = setMove(moves[move], change, "Zeffect", Zeffect)
            }
        }
    })

    return normalizeMoves(moves)
}





function setMove(move, change, input, output){
    if(change){
        move["changes"].push([input, output])
        return move
    }
    else{
       if(move[input] === undefined){
            move[input] = output
            return move
       }
    }
    return move
}










function regexMovesIngameName(textMovesIngameName, moves){
    const lines = textMovesIngameName.split("\n")
    let nameLongFound = false, move = []


    lines.forEach(line => {
        if(nameLongFound === true){
            for (let i = 0; i < move.length; i++)
                moves[move[i]]["ingameName"] = line.trim()
            nameLongFound = false
            move = []
        }


        const matchNameLong = line.match(/NAME_LONG_(\w+)/i)
        if(matchNameLong){
            const nameLong = `MOVE_${matchNameLong[1]}`
            const nameLongReplaced = `MOVE_${matchNameLong[1].replace(/'|_/g, "")}`

            if(moves[nameLong] !== undefined){
                nameLongFound = true
                move.push(nameLong)
            }
            if(moves[`${nameLong}_S`] !== undefined){
                nameLongFound = true
                move.push(`${nameLong}_S`)
            }
            if(moves[`${nameLong}_P`] !== undefined){
                nameLongFound = true
                move.push(`${nameLong}_P`)
            }
            if(moves[nameLongReplaced] !== undefined){
                nameLongFound = true
                move.push(nameLongReplaced)
            }
            if(moves[`${nameLongReplaced}_S`] !== undefined){
                nameLongFound = true
                move.push(`${nameLongReplaced}_S`)
            }
            if(moves[`${nameLongReplaced}_P`] !== undefined){
                nameLongFound = true
                move.push(`${nameLongReplaced}_P`)
            }
        }
        else{
            const test = `MOVE_${line.trim().replace(/ |-|_|'/g, "").toUpperCase()}`
            if(moves[test] != undefined)
                moves[test]["ingameName"] = line.trim()
        }
    })

    return moves
}



















function regexVanillaMovesDescription(textVanillaMovesDescription, moves){
    const lines = textVanillaMovesDescription.split("\n")
    let conversionTable = {}

    for(let i = lines.length - 1; i >= 0; i--){
        let move = lines[i].match(/(MOVE_\w+)/i) //this is going to get confusing real quick :)
        if(move){
            move = move[0].replace(/_/g, "").replace(/MOVE/i, "MOVE_")

            if(move === "MOVE_FAINTATTACK")
                move = "MOVE_FEINTATTACK"
            else if(move === "MOVE_HIJUMPKICK")
                move = "MOVE_JUMPKICK"

        }


        const matchConversionDescription = lines[i].match(/gMoveDescription_\w+/i)
        if(matchConversionDescription){
            const conversionDescription = matchConversionDescription[0]



            if(move){ // :=)


                if(conversionTable[conversionDescription] === undefined)
                    conversionTable[conversionDescription] = [move]
                else
                    conversionTable[conversionDescription].push(move)


            }
            else{
                const matchDescription = lines[i].match(/_ *\( *" *(.*)" *\) *;/i)
                if(matchDescription){
                    const description = [matchDescription[1].replace(/\\n/gi, " ").replace(/\\/g, "")]
                    if(conversionTable[conversionDescription] !== undefined){
                        if(moves[conversionTable[conversionDescription][0]] !== undefined){
                            for(let j = 0; j < conversionTable[conversionDescription].length; j++)
                                moves[conversionTable[conversionDescription][j]]["description"] = description
                        }
                    }
                }
            }
        }
    }
    return moves
}








function regexMovesFlags(JSONMovesFlags, moves){
    Object.keys(JSONMovesFlags).forEach(key => {
        for(let i = 0; i < JSONMovesFlags[key].length; i++){
            const move = JSONMovesFlags[key][i]
            if(move in moves){
                moves[move]["flags"].push(key.replace(/([A-Z])/g, '_$1').replace(/^g/i, "FLAG").toUpperCase())
            }
        }
    })
    return moves
}









function normalizeMoves(moves){

    for (const move of Object.keys(moves)){

        if(moves[move]["power"] === undefined)
            moves[move]["power"] = 0

        if(moves[move]["PP"] === undefined)
            moves[move]["PP"] = 0

        if(moves[move]["type"] === undefined)
            moves[move]["type"] = ""

        if(moves[move]["accuracy"] === undefined)
            moves[move]["accuracy"] = 0

        if(moves[move]["split"] === undefined)
            moves[move]["split"] = ""

        if(moves[move]["effect"] === undefined)
            moves[move]["effect"] = ""

        if(moves[move]["chance"] === undefined)
            moves[move]["chance"] = ""

        if(moves[move]["chance"] === undefined)
            moves[move]["chance"] = 0

        if(moves[move]["target"] === undefined)
            moves[move]["target"] = ""

        if(moves[move]["flags"] === undefined)
            moves[move]["flags"] = [""]

        if(moves[move]["priority"] === undefined)
            moves[move]["priority"] = 0

        if(moves[move]["Zpower"] === undefined)
            moves[move]["Zpower"] = 0

        if(moves[move]["Zeffect"] === undefined)
            moves[move]["Zeffect"] = ""

        if(moves[move]["Zeffect"] === undefined)
            moves[move]["Zeffect"] = ""

        if(moves[move]["maxPower"] === undefined)
            moves[move]["maxPower"] = ""
    }

    return moves
}