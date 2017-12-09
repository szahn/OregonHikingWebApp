import React from 'react';
import trailsJson from 'json-loader!./trails';
import distanceFromLatLon from "./common/distanceFromLatLon";
import TrailListItem from './trailListItem.jsx';
import trailList from './trailList';

const skills = {
  'Easy':1,
  'Moderate':2,
  'Difficult': 3
}

module.exports = (minMiles, maxMiles, skill, origin, orderBy) => {
    const filtered = [];

    const trails = trailList();
    for (var trail of trails){
  
      if (trail.measures.difficulty){
        trail.difficulty = trail.measures.difficulty || "";
        if (skill && trail.measures.difficulty && skill !== skills[trail.measures.difficulty]){
          continue;
        }
      }
  
      const miles = trail.measures.distance ? parseFloat(trail.measures.distance.value || 0) : 0;
      trail.milesVal = miles || 0;

      if (miles){
        trail.miles =  miles + " " + trail.measures.distance.measure || "miles";
        if (miles && maxMiles && miles > maxMiles){
          continue;
        }
        if (miles && minMiles && miles < minMiles){
          continue;
        }
      }
  
      trail.distMiles = 0;
      if (trail.locations && trail.locations.trailStart && trail.locations.trailStart.latitude && trail.locations.trailStart.longitude && origin && origin.lat && origin.lon){
        const distMiles = distanceFromLatLon(origin.lat, origin.lon, trail.locations.trailStart.latitude, trail.locations.trailStart.longitude).miles;            
        trail.distMiles = distMiles;
        trail.milesAway = distMiles + " miles away";
      }
  
      filtered.push(trail);
    }
  
    filtered.sort((a, b)=>{

      if (orderBy === 2){
        return a.milesVal - b.milesVal;
      }
      else if (orderBy === 1){
        return a.distMiles - b.distMiles;
      }

      return 0;
    });
  
    return filtered.map((trail, i)=> <TrailListItem trail={trail} index={i}/>);
}
  