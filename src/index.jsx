import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {List} from 'material-ui/List';
import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Button from 'material-ui/FlatButton';
import Ribbon from './ribbon.jsx';
import {throttle} from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';

import buildTrailsList from './trailListBuilder.jsx';

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
    this.onDifficultyChangedLocal = throttle(this.onDifficultyChanged.bind(this), 60);
    this.onSortByChangedLocal = throttle(this.onSortByChanged.bind(this), 60);
    this.onMinMilesChangedLocal = throttle(this.onMinMilesChanged.bind(this), 60);
    this.onMaxMilesChangedLocal = throttle(this.onMaxMilesChanged.bind(this), 60);
    this.refreshLocationLocal = this.refreshLocation.bind(this);

    this.state = {
      maxMiles: 3,
      minMiles: 1,
      skill: 0,
      sortBy: 1,
      origin: {lat: 0, lon:0},
      trailsList: [],
      isBusy: true
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
    trailsList: buildTrailsList(this.state.minMiles, this.state.maxMiles, this.state.skill, this.state.origin, value)
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
    this.setState({
      isBusy: true
    });

    if (!navigator.geolocation){
      alert("Geolocation API not available.")
      this.setState({
        isBusy: false
      });
      return;
    }

    navigator.geolocation.getCurrentPosition((pos)=>{
      var crd = pos.coords;
      this.setState({
        origin: {lat: crd.latitude, lon:crd.longitude},
        trailsList: buildTrailsList(this.state.minMiles, this.state.maxMiles, this.state.skill, {lat: crd.latitude, lon:crd.longitude}, this.state.sortBy),
        isBusy: false
      });
    }, (err)=>{
      alert(err.message);
      this.setState({
        isBusy: false
      });
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
}

componentWillMount(){
  setTimeout(this.refreshLocation.bind(this), 250);
}

render() {   
    const title = `${this.state.trailsList.length} Oregon Trails`;
    return (
        <MuiThemeProvider>
        <div>
          <AppBar className='green900-bg' title={title} iconStyleLeft={styles.appBarIconStyleLeft}></AppBar>        
          <div style={styles.container}>
            <p>My Location: <Button onClick={this.refreshLocationLocal} label="Refresh Location"/></p>
            <div>
              <div style={styles.sliderContainer}>
              Skill:
              <RadioButtonGroup name="difficulty" defaultSelected={0} onChange={this.onDifficultyChangedLocal} valueSelected={this.state.skill}>
                <RadioButton value={0} label="Any Difficulty"/>
                <RadioButton value={1} label="Easy"/>
                <RadioButton value={2} label="Moderate"/>
                <RadioButton value={3} label="Hard"/>
              </RadioButtonGroup>
              </div>
              <div style={styles.sliderContainer}>
              Order By:
              <RadioButtonGroup name="orderBy" defaultSelected={1} onChange={this.onSortByChangedLocal} valueSelected={this.state.sortBy}>
                <RadioButton value={1} label="Distance"/>
                <RadioButton value={2} label="Miles"/>
              </RadioButtonGroup>
              </div>
            </div>
            <div>
              <div style={styles.sliderContainer}>
                <p>Min. Miles: {this.state.minMiles}</p>
                <Slider sliderStyle={styles.sliderStyle} min={0} max={20} step={1} value={this.state.minMiles} onChange={this.onMinMilesChangedLocal} />
              </div>
              <div style={styles.sliderContainer}>
                <p>Max. Miles: {this.state.maxMiles}</p>
                <Slider sliderStyle={styles.sliderStyle} min={0} max={20} step={1} value={this.state.maxMiles} onChange={this.onMaxMilesChangedLocal} />
              </div>
            </div>
            <List>
                {this.state.trailsList}            
            </List>
            </div>
            <Ribbon/>
            {this.state.isBusy && <div style={{background:'#FFFA', position: 'fixed', left: 0, right:0, top:0, bottom:0}}>
                <CircularProgress style={{position: 'fixed', right: '50%', top: '50px', zIndex: 9999, margin: '50px auto'}}/>
              </div>}
        </div>
        </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
