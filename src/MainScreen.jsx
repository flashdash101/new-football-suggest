import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import PlayerCard from './PlayerCard';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { positionStats, statNames, positionMapping, defaultPositionStats } from './statsConfigs';
const MainScreen = ({ selectedOption, selectedSecondOption, playingStyle }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const isInitialMount = React.useRef(true);


  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://football-suggest3-mkj3ly2lna-nw.a.run.app/get_recommendations', {
        category: selectedOption,
        subcategory: selectedSecondOption,
        min_minutes: 0,
        distance_metric: 'pearson',
        playing_style: playingStyle
      });
      console.log('API Response:', response.data);

      if (Array.isArray(response.data.recommendations)) {
        setRecommendations(response.data.recommendations);
      } else if (Array.isArray(response.data)) {
        setRecommendations(response.data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError('We failed to fetch recommendations... bear with us: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, [selectedOption, selectedSecondOption, playingStyle]);

  const debouncedFetchRecommendations = useCallback(
    debounce(fetchRecommendations, 150),
    [fetchRecommendations]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      console.log('Fetching recommendations...');
      debouncedFetchRecommendations();
    }
    // Cleanup function
    return () => {
      debouncedFetchRecommendations.cancel();
    };
  }, [debouncedFetchRecommendations]);

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

  const mappedPosition = mapPositionToKey(selectedOption);
  const mappedSubPosition = mapPositionToKey(selectedSecondOption);


  const renderPolarAngleAxis = (props) => {
    const { payload, x, y, cx, cy, ...rest } = props;
    const words = payload.value.split(' ');
    const firstLine = words.slice(0, 2).join(' ');
    const secondLine = words.slice(2).join(' ');

    return (
      <text
        {...rest}
        verticalAnchor="middle"
        y={y + (y > cy ? 10 : -10)}
        x={x}
        textAnchor={x > cx ? 'start' : 'end'}
        style={{ fontSize: '11px' }}
      >
        <tspan x={x} dy="0">{firstLine}</tspan>
        {secondLine && <tspan x={x} dy="12">{secondLine}</tspan>}
      </text>
    );
  };



  const getRelevantStats  = () => {
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
    return Object.keys(statNames);
  };






  const prepareChartData = useCallback(() => {
    if (recommendations.length === 0) return [];
    
    const relevantStats = getRelevantStats();
    const chartData = relevantStats.map(stat => {
      const statValues = recommendations.map(player => player.stats[stat] || 0);
      const minValue = Math.min(...statValues);
      const maxValue = Math.max(...statValues);
      
      return {
        subject: statNames[stat] || stat,
        ...recommendations.reduce((acc, player) => {
          acc[player.player] = normalizeValue(player.stats[stat] || 0, minValue, maxValue);
          return acc;
        }, {})
      };
    });
  
    return chartData;
  }, [recommendations, getRelevantStats]);

  const toggleView = () => setShowChart(!showChart);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return <div>No recommendations available.</div>;
  }

  console.log(`The selected position is: ${selectedOption}`);
  console.log(`The selected sub-position is: ${selectedSecondOption}`);

  const normalizeValue = (value, min, max) => {
    if (min === max) return 50; // If all values are the same, return a mid-point
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };



  return (
    <div className="main-screen">
      <button onClick={toggleView}>
        {showChart ? 'Show Player Cards' : 'Show Radar Chart'}
      </button>
      {showChart ? (
        <ResponsiveContainer width="100%" height={600} minHeight={600} minWidth={600}>
          <RadarChart outerRadius="70%" data={prepareChartData()}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
              dataKey="subject"
              tick={renderPolarAngleAxis}
              allowDuplicatedCategory={false}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {recommendations.map((player, index) => (
              <Radar 
                key={player.player} 
                name={player.player} 
                dataKey={player.player} 
                stroke={`hsl(${index * 360 / recommendations.length}, 70%, 50%)`} 
                fill={`hsl(${index * 360 / recommendations.length}, 70%, 50%)`} 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Legend 
              iconSize={10} 
              wrapperStyle={{ fontSize: 15, paddingTop: '20px' }}
              layout="horizontal"
              align="center"
            />
            {/* <Tooltip /> */}
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="card-container">
          {recommendations.map((player, index) => (
            <PlayerCard 
              key={`${player.player}-${index}`}
              player={player}
              index={index}
              selectedPosition={selectedOption}
              selectedSubPosition={selectedSecondOption}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainScreen;