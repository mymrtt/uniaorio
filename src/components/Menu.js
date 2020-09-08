// Libs
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

// Images
import Check from '../assets/check.svg';
import Logo from '../assets/logo.png';
import densHorizontal from '../assets/densHorizontal.svg';
import densVertical from '../assets/densVertical.svg';
import densDiagonal from '../assets/densDiagonal.svg'

import filterIcon3 from '../assets/filter-icon-3.svg';
import filterIcon4 from '../assets/filter-icon-4.svg';
import filterIcon6 from '../assets/filter-icon-6.svg';
import filterSelectedIcon3 from '../assets/filter-selected-icon-3.svg';
import filterSelectedIcon4 from '../assets/filter-selected-icon-4.svg';
import filterSelectedIcon6 from '../assets/filter-selected-icon-6.svg';

class Menu extends Component {
  state = {
    averageIncome: [
      {
        text: 'Até R$1.254,00',
        color: '#FF6600',
      },
      {
        text: 'R$1.255,00 - R$2.004,00',
        color: '#FCA446',
      },
      {
        text: 'R$2.005,00 - R$8.640,00',
        color: '#F2FC36',
      },
      {
        text: 'R$8.641,00 - R$11.261,00',
        color: '#6bfc36',
      },
      {
        text: 'Além de R$11.261,00',
        color: '#267300',
      },
    ],
    demographicDensity: [
      {
        text: '100 - 500 hab.',
      },
      {
        text: '100 - 500 hab.',
        img: densDiagonal,
        imgDesc: 'Hachura Vertical'
      },
      {
        text: '1.001 - 5.000 hab.',
        img: densVertical,
        imgDesc: 'Hachura Horizontal'
      },
      {
        text: 'Acima de 5.001',
        img: densHorizontal, 
        imgDesc: 'Hachura Diagonal'
      },
    ],
    demandsandDeliveries: [
      {
        color: '#A3218E',
        text: '10.000 cestas demandadas',
      },
      {
        color: '#592F93',
        text: '1.000 cestas demandadas',
      },
      {
        color: '#0465B2',
        text: '100 cestas demandadas',
      },
      {
        color: '#00ACAC',
        text: '10 cestas demandadas',
      },
    ],
    menuItems: [
      {
        image: filterIcon3,
        selectedImage: filterSelectedIcon3,
        title: 'Solidariedade',
        color: '#F0184F',
        text: 'solid',
        layerName: 'Solidariedade'
      },
      {
        image: filterIcon4,
        selectedImage: filterSelectedIcon4,
        title: 'Covid-19',
        color: '#0ACF59',
        text: 'covid',
        layerName: 'Covid'
      },
      // {
      //   image: filterIcon6,
      //   selectedImage: filterSelectedIcon6,
      //   title: 'Transparência',
      //   color: '#FA9900',
      //   text: 'painel',
      // }
    ],
    // isMapping: false,
    isSelectedButton: '',
    isSelectedCheck: ['Sócio-Econômico', 'Densidade Demográfica'],
    isSelected: '',
    isSocioEconomic: false,
    DemographicDensity: false,
    isDemandsandDeliveries: false,
  };

  handleSelected = (label) => {    
    this.setState({ isSelectedButton: label });
  }

  renderDemandsandDeliveries = () => (
    <div className="container_infos">
      {this.state.demandsandDeliveries.map(({color, text}) => (
        <div className="container_infos-item">
          <span className="container_infos-item--box infos_item-demand" style={{background: color}} />
          {text}
        </div>
      ))}
    </div>
  )

  renderDemographicDensity = () => (
    <div className="container_infos">
      {this.state.demographicDensity.map(({text, img, imgDesc}) => (
        <div className="container_infos-item">
          <span className="container_infos-item--box">
            <img src={img} alt={imgDesc} className="density_img" />
          </span>
          {text}
        </div>
      ))}
    </div>
  )

  renderSocioEconomic = () => (
    <div className="container_infos">
      {this.state.averageIncome.map(({text, color}) => (
        <div className="container_infos-item">
          <span className="container_infos-item--box" style={{backgroundColor: color}} />
          {text}
        </div>
      ))}
    </div>
  )

  handleMappingCheck = (item) => {
    let list = this.state.isSelectedCheck;
    const hasMatch = list.find(value => value === item);
    
    if (hasMatch) {
      list.splice(list.indexOf(item), 1);
    } else {
      list = list.concat(item);
    }

    this.setState({
      isSelectedCheck: list,
    });
  }

  renderCheckIcon = (item) => {
    const hasMatch = this.state.isSelectedCheck.find(value => value === item);

    if (hasMatch) {
      return  (
        <img src={Check} alt="check" className="mapping_item-checkbox--check" />
      );
    } return null;
  }

  renderDataItem = (item) => {
    const hasMatch = this.state.isSelectedCheck.find(value => value === item);
    switch(item && hasMatch) {
      case 'Sócio-Econômico':
			return this.renderSocioEconomic();
      case 'Densidade Demográfica':
        return this.renderDemographicDensity();
      case 'Demandas e Entregas':
        return this.renderDemandsandDeliveries();
      case "ONG's Parceiras":
      default:
        return null;
    }
  }

  renderMenuItem = () => {
    const { menuItems } = this.state;
    return menuItems.map(item => {
      const currentItem = this.props.selectedMenuItem.title === item.title;
      const setColor = currentItem ? item.color : '#595959';
      const setFont = currentItem ? '600' : '200';
      const setBackground = currentItem ? item.color : '#fff';
      const setOpacity = this.props.selectedMenuItem ? 1 :  0.5;

      return (
        <li
          key={item.title}
          onClick={() => this.props.selectedMenuItem && this.props.selectMenuItem(item)}
          style={{ 'color': `${setColor}`, 'fontWeight': `${setFont}`, opacity: `${setOpacity}`}}>
          <img src={currentItem ? item.selectedImage : item.image} alt='Icone'/>
          <p>{item.title}</p>
          <span className='line' style={{ 'background': `${setBackground}`, 'transition': 'all .25s ease-in-out' }}></span>
        </li>
      )}
    );
  }
  render() {
    return (
      <nav className="menu">
        <div className="menu-container">
          <div className="menu-logo">
            <NavLink to={'/uniaorio'}>
              <img src={Logo} alt="logo"/>
            </NavLink>
            <div>
              <p>Última atualização</p>
              <p className="text-red">18:39 - 28.05.20</p>
            </div>
          </div>
          <ul className="menu-filters">
            {this.renderMenuItem()}
          </ul>
          <a href={'https://www.riocontracorona.org/'} target="_blank" rel="noopener noreferrer" className='donation-button'>
            Faça uma doação
          </a>
        </div>
      </nav>
    );
  }
}

export default Menu;