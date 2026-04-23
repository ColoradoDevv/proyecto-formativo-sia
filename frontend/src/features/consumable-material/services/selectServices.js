export async function getBrands(){

    const res = await fetch("/../../data/selects/brands.json")
    
    return res.json()

}

export async function getStates(){

    const res = await fetch("/../../data/selects/state.json")
    
    return res.json()

}