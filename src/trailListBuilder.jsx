import React from 'react';
import trailsJson from 'json-loader!./trails';
import distanceFromLatLon from "./common/distanceFromLatLon";
import TrailListItem from './trailListItem.jsx';

const trailsList = [].concat(trailsJson.items);

const skills = {
  'Easy':1,
  'Moderate':2,
  'Difficult': 3
}

module.exports = (minMiles, maxMiles, skill, origin, orderBy) => {
    const filtered = [];
    for (var trailJson of trailsList){
      if (trailJson.measures.difficulty){
        if (skill && trailJson.measures.difficulty && skill !== skills[trailJson.measures.difficulty]){
          continue;
        }
      }

      const miles = trailJson.measures.distance ? parseFloat(trailJson.measures.distance.value || 0) : 0;

      if (miles){
        if (miles && maxMiles && miles > maxMiles){
          continue;
        }
        if (miles && minMiles && miles < minMiles){
          continue;
        }
      }

      let trail = Object.assign({}, {
        difficulty: trailJson.measures.difficulty || "",
        milesVal: miles || 0,
      }, trailJson);
  
      if (miles){
        trail.miles =  miles + " " + trail.measures.distance.measure || "miles";
      }
  
      trail.distMiles = 0;
      if (trail.locations && trail.locations.trailStart && trail.locations.trailStart.latitude && trail.locations.trailStart.longitude && origin && origin.lat && origin.lon){
        const distMiles = distanceFromLatLon(origin.lat, origin.lon, trail.locations.trailStart.latitude, trail.locations.trailStart.longitude).miles;            
        trail.distMiles = distMiles;
        trail.milesAway = distMiles + " miles away";
      }
  
      filtered.push(trail);
    }
  
    filtered.sort((a, b) => {

      if (orderBy === 2){
        return a.milesVal - b.milesVal;
      }
      else if (orderBy === 1){
        return a.distMiles - b.distMiles;
      }

      return 0;
    });
  
    return filtered.map((trail, i)=> <TrailListItem key={trail.id} trail={trail} index={i}/>);
}
  