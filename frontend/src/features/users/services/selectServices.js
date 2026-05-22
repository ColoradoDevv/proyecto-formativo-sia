export async function getDocumentTypes(){

    const res = await fetch("/../../data/selects/documentTypes.json")
    
    return res.json()

}

export async function getUserRoles(){

    const res = await fetch("/../../data/selects/userRoles.json")
    
    return res.json()

}