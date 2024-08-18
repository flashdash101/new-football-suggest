import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const RadarChartComponent = ({ players, relevantStats }) => {
  const data = relevantStats.map(stat => ({
    subject: stat,
    ...players.reduce((acc, player) => {
      acc[player.player] = player.stats[stat];
      return acc;
    }, {})
  }));

  // Custom tick formatter function
  const formatTick = (tickItem) => {
    // Split the tick item into words
    const words = tickItem.split(' ');
    // If it's a short label, return as is
    if (words.length <= 2) return tickItem;
    // Otherwise, create a multi-line label
    return words.reduce((acc, word, index) => {
      if (index % 2 === 0) {
        acc.push(word);
      } else {
        acc[acc.length - 1] += ' ' + word;
      }
      return acc;
    }, []).join('\n');
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis 
          dataKey="subject" 
          tickFormatter={formatTick}
          style={{ fontSize: '10px' }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
        {players.map((player, index) => (
          <Radar 
            key={player.player} 
            name={player.player} 
            dataKey={player.player} 
            stroke={`hsl(${index * 360 / players.length}, 70%, 50%)`} 
            fill={`hsl(${index * 360 / players.length}, 70%, 50%)`} 
            fillOpacity={0.6} 
          />
        ))}
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponent;