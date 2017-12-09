import React from 'react';
import trailsJson from 'json-loader!./trails';
import distanceFromLatLon from "./common/distanceFromLatLon";
import TrailListItem from './trailListItem.jsx';

const skills = {
  'Easy':1,
  'Moderate':2,
  'Difficult': 3
}

module.exports = (minMiles, maxMiles, skill, origin, orderBy) => {
    const filtered = [];
    for (var trail of trailsJson.items){
  
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
  
      if (trail.locations && trail.locations.trailStart && trail.locations.trailStart.latitude && trail.locations.trailStart.longitude && origin && origin.lat && origin.lon){
        const distMiles = distanceFromLatLon(origin.lat, origin.lon, trail.locations.trailStart.latitude, trail.locations.trailStart.longitude).miles;            
        trail.distMiles = distMiles;
        trail.milesAway = distMiles + " miles away";
      }
  
      filtered.push(trail);
    }
  
    filtered.sort((a, b)=>{

      const aCMp = (orderBy === 0) ? a.distMiles : a.milesVal;
      const bCMp = (orderBy === 0) ? b.distMiles : b.milesVal;
      
      if (aCMp && bCMp){
        if (aCMp < bCMp){
          return -1;
        }
        if (aCMp > bCMp){
          return 1;
        }
  
        return 0;
      }
      else{
        if (a.name < b.name){
          return -1;
        }
        if (a.name > b.name){
          return 1;
        }
  
        return 0;
      }
    });
  
    return filtered.map((trail)=> <TrailListItem trail={trail}/>);
}
  