export const getAllTimeProfit = async(userId:string)=>{
    const response = await fetch(`/api/portfolio/allTimeProfit?userId=${userId}`)
    const data = await response.json()
    return data
}

export const getBestPerformer = async(userId:string)=>{
    const response = await fetch(`/api/portfolio/bestPerformer?userId=${userId}`)
    const data = await response.json()
    return data
}
export const getWorstPerformer = async(userId:string)=>{
    const response = await fetch(`/api/portfolio/worstPerformer?userId=${userId}`)
    const data = await response.json()
    return data
}
export const getTodayCondition = async(userId:string)=>{
    const response = await fetch(`/api/portfolio/today?userId=${userId}`)
    const data = await response.json()
    return data
}

