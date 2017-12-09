import React from 'react';
import {ListItem} from 'material-ui/List';
import DirectionsIcon from 'material-ui/svg-icons/maps/directions-walk';
import Button from 'material-ui/RaisedButton';

const styles = {
    contentItem: {display: 'inline-block', marginRight: '10px'},
    skill:{
        'Easy': {color: '#01579B', display: 'inline-block', marginRight: '10px'},
        'Moderate': {color: '#FF6F00', display: 'inline-block', marginRight: '10px'},
        'Difficult': {color: '#D50000', display: 'inline-block', marginRight: '10px'}
    }
}

module.exports = (props)=> {
    const {trail} = props;

    const contentItems = [];
    if (trail.difficulty){contentItems.push(<span style={styles.skill[trail.difficulty]}>{trail.difficulty}</span>)}
    if (trail.milesVal){contentItems.push(<span style={styles.contentItem}><b>{trail.milesVal}</b>&nbsp;miles</span>)}
    if (trail.distMiles){contentItems.push(<span><b>{trail.distMiles}</b>&nbsp;miles away</span>)}
   
    const trailUrl = trail.locations && trail.locations.trailStart 
        ? `https://www.google.com/maps/?q=${trail.locations.trailStart.latitude},${trail.locations.trailStart.longitude}`
        : trail.urls.absoluteSource ? trail.urls.absoluteSource : "#";

    return <ListItem key={trail.id}
        rightIconButton={<Button primary={true} style={{width:50, height:50, marginTop:10}} className='green800-bg' icon={<DirectionsIcon/>} target="_blank" href={trailUrl}/>}>
        <div style={{fontSize:'1.1em', marginBottom: 6}}>{trail.name}</div>
        <div>{contentItems}</div>
        </ListItem>;
}