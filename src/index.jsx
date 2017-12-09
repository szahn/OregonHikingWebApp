import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Button from 'material-ui/FlatButton';

import buildTrailsList from './trailListBuilder.jsx';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

const styles = {
  appBarIconStyleLeft: {display:'none'},
  container: {margin:20},
  sliderContainer: {width: '50%', display: 'inline-block'},
  selectFieldStyle:{width:150},
  sliderStyle: {width: '90%'}
};

class App extends Component {

  constructor(){
    super();
    this.state = {
      maxMiles: 3,
      minMiles: 1,
      skill: 0,
      sortBy: 0,
      origin: {lat: 0, lon:0},
      trailsList: [],
    };
}

onDifficultyChanged(event, value){
  this.setState({
    skill: value,
    trailsList: buildTrailsList(this.state.minMiles, this.state.maxMiles, value, this.state.origin, this.state.sortBy)
  });
}

onSortByChanged(event, value){
  this.setState({
    sortBy: value,
    trailsList: buildTrailsList(this.state.minMiles, this.state.maxMiles, value, this.state.origin, this.state.sortBy)
  });
}

onMinMilesChanged (e, minMiles){
    let maxMiles = this.state.maxMiles;
    if (maxMiles && maxMiles < minMiles){
      maxMiles = minMiles;
    }

    this.setState({
      minMiles: minMiles,
      maxMiles: maxMiles,
      trailsList: buildTrailsList(minMiles, maxMiles, this.state.skill, this.state.origin, this.state.sortBy)
    });
}

onMaxMilesChanged (e, maxMiles){
  let minMiles = this.state.minMiles;
  if (minMiles && minMiles > maxMiles){
    minMiles = maxMiles;
  }

    this.setState({
      minMiles: minMiles,
      maxMiles: maxMiles,
      trailsList: buildTrailsList(minMiles, maxMiles, this.state.skill, this.state.origin, this.state.sortBy)
    });
}

refreshLocation(){
    if (!navigator.geolocation){
      return;
    }

    navigator.geolocation.getCurrentPosition((pos)=>{
      var crd = pos.coords;
      this.setState({
        origin: {lat: crd.latitude, lon:crd.longitude},
        trailsList: buildTrailsList(this.state.minMiles, this.state.maxMiles, this.state.skill, {lat: crd.latitude, lon:crd.longitude}, this.state.sortBy)
      });
    }, (err)=>{
      console.log('ERROR(' + err.code + '): ' + err.message);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
}

componentWillMount(){
  setTimeout(this.refreshLocation.bind(this), 1000);
}

render() {   
    const title = `Nearby Trails`;
    return (
        <MuiThemeProvider>
        <div>
          <AppBar className='green900-bg' title='Oregon Trails' iconStyleLeft={styles.appBarIconStyleLeft}></AppBar>        
          <div style={styles.container}>
            <p>My Location: {this.state.origin ? `${this.state.origin.lat}, ${this.state.origin.lon}` : ''} <Button label="Refresh"/></p>
            <div>
              <div style={styles.sliderContainer}>
              Skill:
              <RadioButtonGroup name="difficulty" defaultSelected={0} onChange={this.onDifficultyChanged.bind(this)} valueSelected={this.state.skill}>
                <RadioButton value={0} label="Any Difficulty"/>
                <RadioButton value={1} label="Easy"/>
                <RadioButton value={2} label="Moderate"/>
                <RadioButton value={3} label="Hard"/>
              </RadioButtonGroup>
              </div>
              <div style={styles.sliderContainer}>
              Order By:
              <RadioButtonGroup name="orderBy" defaultSelected={0} onChange={this.onSortByChanged.bind(this)} valueSelected={this.state.sortBy}>
                <RadioButton value={0} label="Distance"/>
                <RadioButton value={1} label="Miles"/>
              </RadioButtonGroup>
              </div>
            </div>
            <div>
              <div style={styles.sliderContainer}>
                <p>Min. Miles: {this.state.minMiles}</p>
                <Slider sliderStyle={styles.sliderStyle} min={0} max={20} step={1} value={this.state.minMiles} onChange={this.onMinMilesChanged.bind(this)} />
              </div>
              <div style={styles.sliderContainer}>
                <p>Max. Miles: {this.state.maxMiles}</p>
                <Slider sliderStyle={styles.sliderStyle} min={0} max={20} step={1} value={this.state.maxMiles} onChange={this.onMaxMilesChanged.bind(this)} />
              </div>
            </div>
            <List primaryText={title}>
                {this.state.trailsList}            
            </List>
            </div>
        </div>
        </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
