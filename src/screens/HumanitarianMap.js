// Libs
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

// Components
import Subtitle from '../components/ModalSubtitle';
import filterIcon3 from '../assets/filter-icon-3.svg';
import filterSelectedIcon3 from '../assets/filter-selected-icon-3.svg';
import vnw from '../assets/vnw.svg';
import { getIndexes } from '../api';
import Loading from '../assets/loading.svg';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWdvcmNvdXRvIiwiYSI6ImNrOWZudjNtcTAyd3EzbHI3a2ppbnpnemUifQ.D--CSyWyEk70oULTVok7vg';

class HumanitarianMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lng: -43.2096,
      lat: -22.9035,
      zoom: 5,
      selectedMenuItem: '',
      showSubtitle: false,
      bairros: {features: []}
    };

    this.map = undefined;
    this.popup = undefined
  }

  choosePopup = (layer, feature) => {
    const district = `${feature.district}`;
    const casosConf = `<p id='covid-color_confirm'>${feature.confirmed_cases}</p>`;
    const mortes = `<p id='covid-color'>${feature.deaths}</p>`;
    const demand = `<p id='solidariedade-color2'>${feature.demands || 0}</p>`;
    const delivered = `<p id='solidariedade-color'>${feature.delivered_amount || 0}</p>`;

    if (layer === 'Solidariedade') {
      // return `
      //   <div class="solidariedade-popup">
      //     <h2>${district}</h2>
      //     <div>
      //       <span>${demand}<small>Demanda</small></span>
      //       <span>${delivered}<small>Cestas-básicas</small></span>
      //       <button item='${district}'>Pontos de entrega</button>
      //     </div>
      //   </div>
      // `
      return `
        <div class="solidariedade-popup">
          <h2>${district}</h2>
          <div>
            <span>${demand}<small>Demandas</small></span>
            <span>${delivered}<small>Cestas básicas</small></span>
          </div>
        </div>
      `
    }
    else if (layer === 'CovidDeaths' || layer === 'CovidCases') {
      return `
        <div class="covid-popup">
          <h2>${district}</h2>
          <div>
            <span>${casosConf}<small>Confirmados</small></span>
            <span>${mortes}<small>Óbitos</small></span>
          </div>
        </div>
        `
    }
  }

  handlePopup = (layerName) => {
    this.map.on('click', layerName, (e) => {
      this.createPopup(e, layerName)
    });
  }

  createPopup = (e, layerName) => {
    if (this.popup && this.popup.isOpen()) {
      this.popup.remove()
    }
    if (!this.popup || (this.popup && !this.popup.isOpen())) {
      let coord = undefined;
  
      coord = e.features[0].geometry.coordinates.slice();
  
      while (Math.abs(e.lngLat.lng - coord[0]) > 180) {
        coord[0] += e.lngLat.lng > coord[0] ? 360 : -360;
      }
  
      const popupMarkup = this.choosePopup(layerName, e.features[0].properties)
  
      this.popup = new mapboxgl.Popup({ closeButton: false })
        .setLngLat(coord)
        .setHTML(popupMarkup)
        .addTo(this.map);

      // if (layerName === 'Solidariedade') {
      //   const popupElem = this.popup.getElement();
      //   const ongButton = popupElem.getElementsByTagName("button")[0]

      //   ongButton.addEventListener('click', (ev) => {
      //     const currentDistrict = ev.target.getAttribute("item");

      //     this.map.setFilter('Solidariedade', ['==', ['get', 'district'], currentDistrict]);

      //     this.setState({
      //       currentDistrict,
      //       showSubtitle: true,
      //     })
      //   })

      //   this.popup.on('close', () => {
      //     this.map.setFilter('Solidariedade', null);

      //     this.setState({
      //       currentDistrict: '',
      //     });
      //   });
      // }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedMenuItem } = this.props;

    if (prevProps.selectedMenuItem !== selectedMenuItem) {
      if (this.popup) {
        this.popup.remove()
      }

      if (selectedMenuItem.text === 'painel') {
        this.map.setLayoutProperty(prevProps.selectedMenuItem.layerName, 'visibility', 'none');
      }
      if (selectedMenuItem.text !== 'painel') {
        if (prevProps.selectedMenuItem.layerName === 'Covid') {
          this.map.setLayoutProperty('CovidDeaths', 'visibility', 'none');
          this.map.setLayoutProperty('CovidCases', 'visibility', 'none');
        }

        if (selectedMenuItem.layerName === 'Covid') {
          this.map.setLayoutProperty('CovidDeaths', 'visibility', 'visible');
          this.map.setLayoutProperty('CovidCases', 'visibility', 'visible');
          this.handlePopup('CovidCases');
        }

        if (prevProps.selectedMenuItem.layerName === 'Solidariedade') {
          if (this.popup) {
            this.popup.remove()
          }
          this.map.setLayoutProperty('Solidariedade', 'visibility', 'none');
        }

        if (selectedMenuItem.layerName === 'Solidariedade') {
          this.map.setLayoutProperty('Solidariedade', 'visibility', 'visible');
        }
      }
    }
  }

  async fetchNeighborhood() {
    try {
      this.setState({ isFetching: true });

      const response = await getIndexes('bairros');
      let geojson = {
        "type":
          "FeatureCollection",
        "features": []
      }
      response.data.data.forEach(item => {
        let feature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [item._source.longitude, item._source.latitude]
          },
          "properties": item._source,
        }

        geojson['features'].push(feature)
      })
      this.setState({
        bairros: geojson,
        isFetching: false,
      });

    } catch (error) {
      console.log(error);
      console.log(error.response);
      this.setState({ isFetching: false });
    }
  }

  async fetchOngs() {
    try {
      this.setState({ isFetching: true });

      const response = await getIndexes('ongs');
      let geojson = {
        "type":
          "FeatureCollection",
        "features": []
      }
      response.data.data.forEach(item => {
        let feature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [item._source.longitude, item._source.latitude]
          },
          "properties": item._source,
        }

        geojson['features'].push(feature)
      })

      this.setState({
        ongs: geojson,
        isFetching: false,
      });

    } catch (error) {
      console.log(error);
      console.log(error.response);
      this.setState({ isFetching: false });
    }
  }

  async componentDidMount() {
    await this.fetchNeighborhood();
    await this.fetchOngs();

    this.setState({ isLoading: false });

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/igorcouto/ck9mtp0zx384s1jwau5diy2w4/',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      minZoom: 7,
      maxZoom: 13,
      maxBounds: [
        [-45.70898, -23.553521],
        [-40.40585, -20.715985]]
    });

    this.map.on('load', () => {
      this.map.flyTo({
        center: [this.state.lng, this.state.lat],
        zoom: 12,
        speed: 0.25
      });

      this.map.addSource('bairros', {
        type: 'geojson',
        data: this.state.bairros
      });

      // cases
      this.map.addLayer({
        "id": "CovidCases",
        "type": "circle",
        "source": "bairros",
        "layout": {
          "visibility": "none",
        },
        "paint": {
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["get", "confirmed_cases"],
            10,
            4,

            50,
            6,

            60,
            8,

            70,
            10,

            80,
            12,

            90,
            14,

            100,
            16,

            200,
            26,

            300,
            36,

            400,
            46,

            500,
            56,

            600,
            66,

            700,
            76,
          ],
          "circle-stroke-color": "hsla(144, 91%, 43%, 0.4)",
          "circle-color": "hsla(144, 91%, 43%, 0.4)",
        }
      });

      //deaths
      this.map.addLayer({
        "id": "CovidDeaths",
        "type": "circle",
        "source": "bairros",
        "layout": {
          "visibility": "none",
        },
        "paint": {
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["get", "deaths"],
            10,
            4,

            50,
            6,

            60,
            8,

            70,
            10,

            80,
            12,

            90,
            14,

            100,
            16,

            200,
            26,

            300,
            36,

            400,
            46,

            500,
            56,

            600,
            66,

            700,
            76,
          ],
          "circle-stroke-color": "hsla(134, 44%, 46%, 0.6)",
          "circle-color": "hsla(134, 44%, 46%, 0.6)",
        }
      });

      // bairros title
      this.map.addLayer({
        "id": "Bairros-Title",
        "type": "symbol",
        "source": "bairros",
        "layout": {
          "text-size": 12,
          "icon-ignore-placement": false,
          "text-field": [
            "case",
            [
              "match",
              ["get", "district"],
              ["NAO INFORMADO"],
              false,
              true
            ],
            ["to-string", ["get", "district"]],
            ["to-string", ["get", "district"]]
          ],
          "text-transform": "lowercase"
        },
        "paint": {
          "text-color": "hsla(0, 0%, 20%, 1)",
          "text-halo-color": "hsla(0, 0%, 100%, 0.7)",
          "text-halo-width": 1,
          "text-halo-blur": 1
        }
      });

      // solidariedade
      this.map.addLayer({
        'id': 'Solidariedade',
        'type': 'symbol',
        'source': 'bairros',
        "layout": {
          "icon-ignore-placement": true,
          "text-size": 12,
          "visibility": "visible",
          "icon-image": [
            "step",
            ["get", "perc_demand_deliv"],
            "",
            1,
            "25 (1)",
            50,
            "50",
            75,
            "75",
            100,
            ""
          ],
          "text-field": [
            "step",
            ["get", "perc_demand_deliv"],
            "",
            1,
            ["concat",
              ["to-string",
                ["round",
                  ["get", "perc_demand_deliv"]
                ]
              ],
              '%'
            ],
            100,
            ""
          ]
        },
        "paint": {
          "text-color": "#fff",
          "icon-opacity": 0.7
        },
      });

      // console.log('layer', this.map.getStyle().layers)
      // console.log('source', this.map.getSource('bairros'))

      this.props.handleMenuItem({
        image: filterIcon3,
        selectedImage: filterSelectedIcon3,
        title: 'Solidariedade',
        color: '#F0184F',
        text: 'solid',
        layerName: 'Solidariedade'
      })

      this.handlePopup('Solidariedade');
    })

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
  }

  handleModalSubtitle = () => {
    this.setState({
      showSubtitle: !this.state.showSubtitle,
    });
  }

  renderLoading = () => (
    <figure className='figureLoadingMap'>
      <img src={Loading} alt='Carregando...' className='imgLoading' />
    </figure>
  )

  handleDoador = doadores => {
    this.map.setFilter('Solidariedade', [
      'in',
      ['get', 'district'],
      ["literal", doadores]
    ]);
  }

  render() {
    const { isLoading, showSubtitle, bairros } = this.state;
    const { setDisplay, selectedMenuItem } = this.props;

    return (
      <div id="map" className="map-container" style={{ 'display': setDisplay }}>
        {isLoading ? this.renderLoading()
          : (
            <>
              <Subtitle
                handleDoador={this.handleDoador}
                ongs={this.state.ongs}
                currentDistrict={this.state.currentDistrict}
                handleModalSubtitle={this.handleModalSubtitle}
                showSubtitle={showSubtitle}
                selectedItem={selectedMenuItem}
                listSolidarity={bairros.features}
              />
              <footer>
                <a rel="noopener noreferrer" target="_blank" href="https://www.vainaweb.com.br/" aria-label="VaiNaWeb logo">
                  <p>Desenvolvido por</p>
                  <img src={vnw} alt="vnw logo"/>
                </a>
              </footer>
              <div ref={el => this.mapContainer = el} className="mapContainer" />
            </>
          )}
      </div>
    );
  }
}

export default HumanitarianMap;