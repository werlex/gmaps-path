import React, { Component, Fragment } from 'react';
import GoogleMap from './GoogleMap'
import Steps from './Steps'
import { calculateDistances } from '../functions/calculations'
import { shortestPath, bruteForce } from '../functions/TSPalgorithms'

export default class App extends Component {
  state = {
    markers: [],
    step: 1,
    runIteration: false,
  };

  map = null;
  google = null;
  polylines = null;
  timeouts = [];

  calculatePath = algorithm => {
    const { markers } = this.state;
    if (algorithm === 'shortest') {
      const { polylineSearch } = shortestPath( markers );
      this.drawPolyline( polylineSearch );
    } else if (algorithm === 'bruteforce') {
      const { polylineSearch } = bruteForce(markers);
      this.drawPolyline( polylineSearch );
    }
  }

  drawPolyline = polylines => {
    this.clearPolylines();
    let timeoutMultiplier = 0

    polylines.forEach( paths => {
      paths.forEach( path => {

        this.timeouts.push(
          setTimeout(()=> {
            this.clearPolylines();
            if(this.state.runIteration){

              this.polylines = new this.google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
              this.polylines.setMap(this.map);

            }
          }, timeoutMultiplier*200)
        );

        timeoutMultiplier++;
      });
    });
    this.timeouts.push( setTimeout(() => this.stopIteration(), timeoutMultiplier*200) );
  }

  clearPolylines = () => this.polylines ? this.polylines.setMap(null) : null;

  updateMarkers = (markers, map, google) => {
    this.map = map;
    this.google = google;
    this.setState({ markers });
  }

  increaseStep = () => this.setState({ step: ++this.state.step })

  startIteration = algorithm => {
    this.setState({ runIteration: true });
    calculateDistances( this.state.markers );
    this.calculatePath( algorithm );
  }

  stopIteration = () => {
    for( let i = 0;  i < this.timeouts.length; i++){
      clearTimeout( this.timeouts[i] )
    }
    while( this.timeouts.length ) this.timeouts.pop();
    this.setState({ runIteration: false });
  }

  render() {
    const { markers } = this.state;

    return (
      <Fragment>
        <Steps increaseStep={this.increaseStep} startIteration={this.startIteration} stopIteration={this.stopIteration} {...this.state} />
        <GoogleMap markers={markers} google={this.props.google} updateMarkers={this.updateMarkers} />
      </Fragment>
    );
  }
}