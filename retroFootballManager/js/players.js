// ==================== PLAYER & TEAM GENERATION ====================

// Generate a unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Calculate player market value
function calculatePlayerValue(player) {
    const baseValue = player.strength * 50000;
    const ageFactor = player.age < 26 ? 1.3 : player.age < 30 ? 1 : 0.7;
    return Math.floor(baseValue * ageFactor);
}

// Generate a single player
function generatePlayer(position, displayName = null, teamName = null) {
    const profile = displayName ? REAL_PLAYER_PROFILES[displayName] : null;
    const age = profile?.age ?? (18 + Math.floor(Math.random() * 17));
    const teamBase = TEAM_STRENGTHS[teamName] ?? 62;
    const positionBonus = { GK: -1, DEF: -1, MID: 0, FWD: 1 }[position] ?? 0;
    const randomAdjustment = Math.floor(Math.random() * 7) - 3;
    const baseStrength = profile?.strength ?? Math.max(45, Math.min(88, teamBase + positionBonus + randomAdjustment));
    const ageFactor = age < 28 ? 1 : 1 - (age - 28) * 0.015;
    
    const player = {
        id: generateId(),
        name: displayName || `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
        position: position,
        age: age,
        energy: 85 + Math.floor(Math.random() * 15), // Start with good energy
        condition: 80 + Math.floor(Math.random() * 20),
        strength: profile ? profile.strength : Math.floor(baseStrength * ageFactor),
        value: 0,
        inTraining: false,
        trainingBonus: 0,
        trainingEnergyCost: 0
    };
    
    player.value = calculatePlayerValue(player);
    return player;
}

// Generate a full squad
function generateSquad(teamName = null) {
    const squad = [];
    const realNames = teamName && REAL_SQUADS[teamName] ? REAL_SQUADS[teamName] : [];
    let realNameIndex = 0;
    
    Object.entries(POSITION_COUNTS).forEach(([pos, count]) => {
        for (let i = 0; i < count; i++) {
            squad.push(generatePlayer(pos, realNames[realNameIndex] || null, teamName));
            realNameIndex++;
        }
    });
    
    return squad;
}

// Generate all teams for the league
function generateTeams() {
    gameState.teams = [];
    for (let i = 0; i < 18; i++) {
        const teamName = TEAM_NAMES[i];
        const team = {
            name: teamName,
            players: generateSquad(teamName),
            stats: {
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0
            },
            budget: 3000000 + Math.floor(Math.random() * 7000000),
            isPlayer: false
        };
        gameState.teams.push(team);
    }
}

// Boost player team at game start
function boostPlayerTeam() {
    const playerTeam = getPlayerTeam();
    playerTeam.isPlayer = true;
    
    playerTeam.players.forEach(p => {
        p.strength = Math.min(99, p.strength + 10);
        p.energy = 90 + Math.floor(Math.random() * 10);
        p.value = calculatePlayerValue(p);
    });
}

// Update all player values in all teams
function updateAllPlayerValues() {
    gameState.teams.forEach(team => {
        team.players.forEach(p => {
            p.value = calculatePlayerValue(p);
        });
    });
}

// Age all players by 1 year
function ageAllPlayers() {
    gameState.teams.forEach(team => {
        team.players.forEach(player => {
            player.age++;
            
            // Retire very old players (randomly, higher chance with age)
            if (player.age > 34 && Math.random() < (player.age - 34) * 0.3) {
                player.retired = true;
            }
            
            // Strength decline for older players
            if (player.age > 32) {
                player.strength = Math.max(30, player.strength - Math.floor(Math.random() * 3));
            }
        });
        
        // Remove retired players
        const retiredPlayers = team.players.filter(p => p.retired);
        retiredPlayers.forEach(p => {
            if (team.isPlayer) {
                showNotification(`${p.name} (${p.age}) has retired from football. Thanks for the memories!`);
            }
        });
        team.players = team.players.filter(p => !p.retired);
    });
}

// Reset energy and condition for new season
function refreshAllPlayers() {
    gameState.teams.forEach(team => {
        team.players.forEach(player => {
            player.energy = 85 + Math.floor(Math.random() * 15);
            player.condition = 80 + Math.floor(Math.random() * 20);
            player.inTraining = false;
            player.trainingBonus = 0;
            player.trainingEnergyCost = 0;
        });
    });
}

// Generate a youth player (younger, cheaper, potential to grow)
function generateYouthPlayer(position) {
    const age = 16 + Math.floor(Math.random() * 3); // 16-18 years old
    const baseStrength = 25 + Math.floor(Math.random() * 25); // Lower base but potential
    
    const player = {
        id: generateId(),
        name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
        position: position,
        age: age,
        energy: 95 + Math.floor(Math.random() * 5), // Youth = lots of energy!
        condition: 90 + Math.floor(Math.random() * 10),
        strength: baseStrength,
        potential: baseStrength + 20 + Math.floor(Math.random() * 30), // Hidden potential
        value: 0,
        inTraining: false,
        trainingBonus: 0,
        trainingEnergyCost: 0,
        isYouth: true
    };
    
    player.value = calculatePlayerValue(player);
    return player;
}

// Try to generate a youth player for player team (called periodically)
function tryGenerateYouthPlayer() {
    const team = getPlayerTeam();
    
    // Max squad size check
    if (team.players.length >= 25) {
        return null;
    }
    
    // Random position weighted towards midfield/forward
    const positions = ['GK', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD'];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    const youthPlayer = generateYouthPlayer(position);
    team.players.push(youthPlayer);
    
    return youthPlayer;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateId, calculatePlayerValue, generatePlayer,
        generateSquad, generateTeams, boostPlayerTeam, updateAllPlayerValues,
        ageAllPlayers, refreshAllPlayers, generateYouthPlayer, tryGenerateYouthPlayer
    };
}
