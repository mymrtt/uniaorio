// Libs
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

// Components
import Menu from '../components/Menu'

// Images
// import MarkerIcon from '../assets/marker.svg';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWdvcmNvdXRvIiwiYSI6ImNrOWZudjNtcTAyd3EzbHI3a2ppbnpnemUifQ.D--CSyWyEk70oULTVok7vg';

class HumanitarianMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -43.2096,
      lat:  -22.9035,
      zoom: 10
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/igorcouto/ck9mtp0zx384s1jwau5diy2w4/draft',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    // MARCADOR!!!
    var marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([0, 0])
      .addTo(map);
      
    function onDragEnd() {
      var lngLat = marker.getLngLat();

      const teste = `longitude ${lngLat.lng}, latitude ${lngLat.lat}` 
      console.log('teste', teste)
      return teste

      // coordinates.style.display = 'block';
      // coordinates.innerHTML =
      // 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    }
      
    marker.on('dragend', onDragEnd);

    map.on('load', () => {
      // var layers = map.getStyle().layers;
      // Find the index of the first symbol layer in the map style
      // var firstSymbolId;
      // for (var i = 0; i < layers.length; i++) {
      //   if (layers[i].type === 'symbol') {
      //     firstSymbolId = layers[i].id;
      //     break;
      //   }
      // }

      // map.addSource('urban-areas', {
      //   'type': 'geojson',
      //   'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson'
      // });
      // map.addLayer({
      //   'id': 'urban-areas-fill',
      //   'type': 'fill',
      //   'source': 'urban-areas',
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#ffa500',
      //     'fill-opacity': 0.6
      //   },
      //   firstSymbolId
      // });
      

      // BOLINHAS!!!
      map.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data:
          'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('earthquakes').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      map.on('click', 'unclustered-point', function (e) {
        console.log('e', e.features)

        var coordinates = e.features[0].geometry.coordinates.slice();
        var mag = e.features[0].properties.mag;
        var tsunami;

        if (e.features[0].properties.tsunami === 1) {
          tsunami = 'yes';
        } else {
          tsunami = 'no';
        }

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
          )
          .addTo(map);
      });

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
      });
    })

    map.addControl(new mapboxgl.NavigationControl());
    //this.queryAll();
  }

  /*queryAll = async () => {
    const { body } = await client.search({
      index: 'ibge_rj',
      body: {
        query: {
          match: {
            quote: 'winter'
          }
        }
      }
    })
    console.log(body.hits.hits)
  }*/

  render() {
    return (
      <div>
        <div>
          <div className='container_map-rio'>
            <p className='map_rio-text'>
              riocontra
            </p>
            <p className='map_rio-text' style={{color: '#F05123'}}>corona</p>
          </div>
          {/* <div className='sidebarStyle'>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div> */}
          <Menu styles={{position: 'absolute', top: 0, left: 0, zIndex: 3}} />
        </div>
        <div ref={el => this.mapContainer = el} className="mapContainer"/>
      </div>
    );
  }
}

export default HumanitarianMap;