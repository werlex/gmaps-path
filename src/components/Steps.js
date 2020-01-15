import React, { Component, Fragment } from 'react';
import style from './style.module.scss'

export default class Steps extends Component {
  state = {
    algorithm: 'shortest',
  }

  handleChange = e => this.setState({ algorithm: e.target.value });

  render() {
    const { step, markers, runIteration } = this.props;
    const { algorithm } = this.state;

    return (
      <div className={style.steps}>
        <h2>Shortest distance calculator</h2>
        {step === 1 &&
          <p>
            Click on map to drop markers in various spots on the map<br />
            <u>You have to select minimum 3 markers in order for algorithms to work.</u><br />
            <p>If you click on selected marker then it will be removed.</p>
            <p>List of all your markers:</p>
            {markers && markers.map(marker =>
              <Fragment key={marker.id}>
                <u>Lat: {marker.lat}, Lng: {marker.lng}</u><br />
              </Fragment>)}
            {markers && <button disabled={markers < 3} className={style.button} onClick={this.props.increaseStep}>Continue</button>}
          </p>}
        {step === 2 &&
          <p>
            Now that you have selected all the markers, please choose wanted algorithm:<br />
            <select
              value={algorithm}
              onChange={this.handleChange}
            >
              <option value="shortest">Shortest Path (always select shortest distance between markers)</option>
              <option value="bruteforce">Brute Force (check all possible paths)</option>
            </select><br />
            {runIteration && <button className={style.button} onClick={this.props.stopIteration}>STOP</button>}
            {!runIteration && <button className={style.button} onClick={() => this.props.startIteration(algorithm)}>Run</button>}
          </p>
        }
      </div>
    );
  }
}
