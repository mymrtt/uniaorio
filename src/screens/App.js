// Libs
import React, { Component } from 'react';

// Components
import Menu from '../components/Menu';
import HumanitarianMap from '../screens/HumanitarianMap';
import Subtitle from '../components/ModalSubtitle';

// Images
import painel from '../assets/painel.svg';
import menu from '../assets/menu.png';
import painel2 from '../assets/painel2.svg';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuItem: '',
      showSubtitle: false,
    };
  }

  componentDidMount() {
    this.renderMap();
  }

  handleMenuItem = (item) => {
    if (item.title !== 'Transparência') {
      this.setState({
        selectedMenuItem: item,
      });
    }
  }

  handleModalSubtitle = () => {
    this.setState({
      showSubtitle: !this.state.showSubtitle,
    });
  }

  renderMap = () => {
    return (
      <HumanitarianMap
        handleMenuItem={this.handleMenuItem}
        selectedMenuItem={this.state.selectedMenuItem}
      />
    )
  }

  renderPainel = () => {
    const setDisplay = this.state.selectedMenuItem.text === 'painel' ? 'flex' : 'none';
    
    return (
      <div className="painel" style={{'display': `${setDisplay}`}}>
        <div className="painel-container">
          <h1>Painel da transparência</h1>
          <p>Geral</p>
          <img className="painel-img" src={painel} alt='Icone' />
          <img className="painel-menu" src={menu} alt='Menu' />
          <img className="painel2" src={painel2} alt='Menu' />
        </div>
      </div>
    )
  }


  render() {
    return (
      <div id="map">
        <Menu
          selectMenuItem={this.handleMenuItem}
          selectedMenuItem={this.state.selectedMenuItem}
        />
        {/* {this.renderMap()}*/}
        {this.renderPainel()} 


         {this.renderMap()}

        {/* <Subtitle
          handleModalSubtitle={this.handleModalSubtitle}
          // showSubtitle={this.state.showSubtitle}
          // selectedItem={this.state.selectedMenuItem}
        /> */}
      </div>
    );
  }
}

export default App;