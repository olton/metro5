import {panic} from "./panic.js";

export const github = async function(repo){
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`)
        if (!response.ok) {
            panic(`We cann't retrive info from GitHub for repo ${repo}`)
        }
        return await response.json()
    } catch (e) {
        panic(e.message)
    }
}