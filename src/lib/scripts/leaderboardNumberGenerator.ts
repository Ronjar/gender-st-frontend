export function getRandomLeaderboardNumber(base: number){
    return base +  (3- Math.floor(Math.random() * 6));
}