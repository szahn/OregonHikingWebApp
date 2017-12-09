import React from 'react';
import {ListItem} from 'material-ui/List';
import DirectionsIcon from 'material-ui/svg-icons/maps/directions-walk';
import Button from 'material-ui/RaisedButton';

module.exports = (props)=> {
    const {trail} = props;

    const chips = [];
    if (trail.difficulty){chips.push(trail.difficulty)}
    if (trail.miles){chips.push(trail.miles)}
    if (trail.milesAway){chips.push(trail.milesAway)}

    const content = chips.join(', ');
    
    const trailUrl = trail.locations && trail.locations.trailStart 
        ? `https://www.google.com/maps/?q=${trail.locations.trailStart.latitude},${trail.locations.trailStart.longitude}`
        : trail.urls.absoluteSource ? trail.urls.absoluteSource : "#";

    return <ListItem key={trail.id} rightIconButton={
        <Button primary={true} className='green800-bg' icon={<DirectionsIcon/>} target="_blank" href={trailUrl}/>} primaryText={trail.name} secondaryText={content}/>;
}