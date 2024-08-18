import React from 'react';
import { positionStats, statNames, positionMapping, defaultPositionStats } from './statsConfigs';

const mapPositionToKey = (position) => {
  const positionMap = {
    'Forward': 'FW',
    'Midfielder': 'MF',
    'Defender': 'DF',
    'Winger': 'W',
    'Striker': 'ST',
    'Attacking Midfielder': 'AM',
    'Central Midfielder': 'CM',
    'Defensive Midfielder': 'DM',
    'Fullback': 'FB',
    'Wingback': 'WB',
    'Centreback': 'CB'
  };
  return positionMap[position] || position;
};

const PlayerCard = ({ player, index, selectedPosition, selectedSubPosition }) => {
  const mappedPosition = mapPositionToKey(selectedPosition);
  const mappedSubPosition = mapPositionToKey(selectedSubPosition);

  const getRelevantStats = () => {
    console.log('Mapped Position:', mappedPosition);
    console.log('Mapped Sub-Position:', mappedSubPosition);

    if (mappedSubPosition && positionStats[mappedSubPosition]) {
      console.log('Using sub-position stats');
      return positionStats[mappedSubPosition];
    }
    
    if (mappedPosition && defaultPositionStats[mappedPosition]) {
      console.log('Using main position stats');
      return defaultPositionStats[mappedPosition];
    }
    
    console.log('Using all stats');
    return Object.keys(player.stats);
  };

  const relevantStats = getRelevantStats();

  console.log('Player stats:', player.stats);  // Add this line for debugging

  const renderStat = (stat) => {
    const value = player.stats[stat];
    return (
      <li key={stat}>
        {statNames[stat] || stat}: {
          value !== null && value !== undefined
            ? (typeof value === 'number'
              ? (stat === 'xG' || stat === 'xA' ? value.toFixed(2) : value.toFixed(0))
              : value.toString())
            : 'N/A'
        }
      </li>
    );
  };

  return (
    <div className="PlayerCard">
      <h2>{player.player || 'Unknown Player'}</h2>
      <p>Position: {player.position || 'N/A'}</p>
      <p>Club: {player.club || 'N/A'}</p>
      <p>Similarity: {player.similarity ? player.similarity.toFixed(2) : 'N/A'}</p>
      <h3>Stats (Based on {selectedSubPosition || selectedPosition}):</h3>
      <ul>
        {relevantStats.map(renderStat)}
      </ul>
    </div>
  );
};

export default React.memo(PlayerCard);