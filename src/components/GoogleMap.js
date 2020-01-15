import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import style from './style.module.scss'

export class GoogleMap extends Component {
  markerId = 1;

  onMarkerClick = (props, clickedMarker) => {
    const { markers, updateMarkers } = this.props;
    updateMarkers(markers.filter(marker => marker.id !== clickedMarker.id), props.map);
  }


  onMapClicked = (mapProps, map, clickEvent) => {
    const { markers, updateMarkers } = this.props;

    markers.push({ lat: clickEvent.latLng.lat(), lng: clickEvent.latLng.lng(), name: `Marker ${this.markerId}`, id: this.markerId });
    this.markerId++;
    updateMarkers(markers, map, mapProps.google);
  };

  render() {
    const { loaded, google, markers } = this.props;
    if (!loaded) return <div>Loading...</div>;

    return (
      <Map
        className={style.map}
        google={google}
        onClick={this.onMapClicked}
        style={{ height: '100%', position: 'relative', width: '100%' }}
        zoom={14}
      >
        {markers.map(marker => {
          return <Marker
            key={marker.name}
            name={marker.name}
            id={marker.id}
            onClick={this.onMarkerClick}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        })}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('GOOGLE_API_KEY')
})(GoogleMap)