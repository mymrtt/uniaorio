// /* eslint-disable array-callback-return */
// // Libs
// import React, { Component } from 'react';

// // Components
// import Menu from '../components/Menu';

// // Images
// // import dropdownIcon from '../assets/dropdown.svg';
// import dropdownBlack from '../assets/dropdownBlack.svg';
// import Loading from '../assets/loading.svg';

// // Api
// import { getAllNeighborhood } from '../api';


// class Grid extends Component {
//   state = {
//     tableTitles: [
//       'Bairro',
//       'Renda Média',
//       'Nº de Casos',
//       'Nº de Óbitos',
//       'Demandas de Cestas',
//       'Cestas Entregues',
//       '%'
//     ],
//     selectedValue: 'Selecionar',
//     selectedItems: [
//       'Selecionar',
//       'Bairros A-Z',
//       'Bairros Z-A',
//       'Maior Renda Média',
//       'Menor Renda Média',
//       'Maior Nº de Casos',
//       'Menor Nº de Casos',
//       'Maior Ocorrência de Óbitos',
//       'Menor Ocorrência de Óbitos',
//       'Maior Demanda de Cestas',
//       'Menor Demanda de Cestas',
//       'Maior Nº de Cestas Entregues',
//       'Menor Nº de Cestas Entregues',
//     ],
//     isDropdownSelected: false,
//     neighborhoodData: [],
//     isFetching: false,
//   }

//   componentDidMount() {
//     this.fetchNeighborhood();
//   }

//   async fetchNeighborhood() {
//     try {

//       this.setState({ isFetching: true });

//       const response = await getAllNeighborhood();
//       const data = response.data.data.map((item) => ({
//         ...item,
//         _source: {
//           ...item._source,
//           cestas_doadas: !item._source.delivered ? 0 : parseInt(item._source.delivered),
//           cestas_demandadas: !item._source.demands ? 0 : parseInt(item._source.demands),
//           Renda_per_capita_sal_min: parseFloat(item._source.Renda_per_capita_sal_min.split(',').join('.'))
//         }
//       }))

//       this.setState({
//         neighborhoodData: data,
//         isFetching: false,
//       });

//     } catch (error) {
//       console.log(error);
//       console.log(error.response);
//       this.setState({ isFetching: false });
//     }
//   }

//   handleSelectedValue = (item) => {
//     this.setState({
//       selectedValue: item,
//       isDropdownSelected: false,
//     });

//     if (item === "Bairros A-Z") {
//       const order = this.state.neighborhoodData.sort((item, b) => item._source.district.localeCompare(b._source.district))

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === "Bairros Z-A") {
//       const order = this.state.neighborhoodData.sort((item, b) => item._source.district.localeCompare(b._source.district)).reverse()

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Maior Renda Média') {
//       const order = this.state.neighborhoodData.sort((a, b) => a._source.Renda_per_capita_sal_min - b._source.Renda_per_capita_sal_min).reverse();

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Menor Renda Média') {
//       const order = this.state.neighborhoodData.sort((a, b) => a._source.Renda_per_capita_sal_min - b._source.Renda_per_capita_sal_min);

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Maior Nº de Casos') {
//       const order = this.state.neighborhoodData.sort((a, b) => a._source.CasosConfirmados - b._source.CasosConfirmados).reverse();

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Menor Nº de Casos') {
//       const order = this.state.neighborhoodData.sort((a, b) => a._source.CasosConfirmados - b._source.CasosConfirmados);

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Maior Ocorrência de Óbitos') {
//       const order = this.state.neighborhoodData.sort((a, b) => a._source.Obitos - b._source.Obitos).reverse();

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Menor Ocorrência de Óbitos') {
//       const order = this.state.neighborhoodData.sort((a, b) => a._source.Obitos - b._source.Obitos);

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Maior Demanda de Cestas') {
//       const order = this.state.neighborhoodData.sort((a, b) => {
//         if (a._source.cestas_demandadas === b._source.cestas_demandadas) {
//           return 0
//         }
//         if (a._source.cestas_demandadas < b._source.cestas_demandadas) {
//           return -1
//         }
//         if (a._source.cestas_demandadas > b._source.cestas_demandadas) {
//           return 1
//         }
//       }).reverse();

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Menor Demanda de Cestas') {
//       const order = this.state.neighborhoodData.sort((a, b) => {
//         if (a._source.cestas_demandadas === b._source.cestas_demandadas) {
//           return 0
//         }
//         if (a._source.cestas_demandadas < b._source.cestas_demandadas) {
//           return -1
//         }
//         if (a._source.cestas_demandadas > b._source.cestas_demandadas) {
//           return 1
//         }
//       });

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Maior Nº de Cestas Entregues') {
//       const order = this.state.neighborhoodData.sort((a, b) => {
//         if (a._source.cestas_doadas === b._source.cestas_doadas) {
//           return 0
//         }
//         if (a._source.cestas_doadas < b._source.cestas_doadas) {
//           return -1
//         }
//         if (a._source.cestas_doadas > b._source.cestas_doadas) {
//           return 1
//         }
//       }).reverse();

//       this.setState({ neighborhoodData: order })
//     }

//     if (item === 'Menor Nº de Cestas Entregues') {
//       const order = this.state.neighborhoodData.sort((a, b) => {
//         if (a._source.cestas_doadas === b._source.cestas_doadas) {
//           return 0
//         }
//         if (a._source.cestas_doadas < b._source.cestas_doadas) {
//           return -1
//         }
//         if (a._source.cestas_doadas > b._source.cestas_doadas) {
//           return 1
//         }
//       });

//       this.setState({ neighborhoodData: order })
//     }
//   }

//   handleSelectOpen = () => {
//     this.setState({
//       isDropdownSelected: !this.state.isDropdownSelected,
//     });
//   }

//   handleSelectClose = () => {
//     if (this.state.isDropdownSelected) {
//       this.setState({
//         isDropdownSelected: false,
//       });
//     }
//   }

//   convertValue = (value) => {
//     let item = value * 1000;
//     return item.toLocaleString('pt-BR');
//   }

//   render() {
//     const { selectedValue, isDropdownSelected, selectedItems, tableTitles, neighborhoodData } = this.state;
//     return (
//       <div className="Grid">
//         <Menu />
//         <div className="container_grid">
//           <div className='container_map-rio'>
//             <p className='map_rio-text'>
//               riocontra
//             </p>
//             <p className='map_rio-text' style={{ color: '#F05123' }}>corona</p>
//           </div>
//           <div className="container_grid-content" onClick={this.handleSelectClose}>
//             <div className="container_grid-content--header">
//               <h2 className="header_title">Estatísticas por Bairro</h2>
//               <div className="container_header-sortBy">
//                 <p className="container_header-sortBy--title">Classificar por:</p>
//                 <div className="container_header-sortBy--input">
//                   <div className="header_sortBy-input" onClick={this.handleSelectOpen}>
//                     <p className="sortBy_textSeleted">{selectedValue}</p>
//                     <img src={dropdownBlack} alt="dropdown" />
//                   </div>
//                   {isDropdownSelected && (
//                     <div className="sortBy_selectedItem">
//                       {selectedItems.map((item, index) => (
//                         <p
//                           className="sortBy_selectedItem-text"
//                           onClick={() => this.handleSelectedValue(item)}
//                           key={index}
//                         >
//                           {item}
//                         </p>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="table">
//               <table className="container_table">
//                 <thead className="container_table-head">
//                   <tr className="container_table-tr">
//                     {tableTitles.map((title, index) => (
//                       <th
//                         key={index}
//                         className="container_table-title"
//                         style={{ textAlign: title === 'Bairro' ? 'left' : 'center' }}
//                       >
//                         {title}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {neighborhoodData.map((item, index) => (
//                     <tr key={index} className="container_table-tr">
//                       <td className="container_table-text container_table-text--neighborhood">{item._source.district}</td>
//                       <td className="container_table-text">R$ {this.convertValue(item._source.Renda_per_capita_sal_min)}</td>
//                       <td className="container_table-text">{item._source.CasosConfirmados}</td>
//                       <td className="container_table-text">{item._source.Obitos}</td>
//                       <td className="container_table-text">{item._source.cestas_demandadas.toLocaleString('pt-BR')}</td>
//                       <td className="container_table-text"> {item._source.cestas_doadas.toLocaleString('pt-BR')}</td>
//                       {item && item._source.cestas_demandadas && item._source.cestas_doadas ? (
//                         <td className="container_table-text">
//                           {(item._source.cestas_doadas * 100 / item._source.cestas_demandadas).toFixed(0)}%
//                         </td>
//                       ) : (
//                         <td className="container_table-text">0</td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {this.state.isFetching && (
//                 <figure className="container_table-loader">
//                   <img src={Loading} alt="Carregando..." className="table-loader" />
//                 </figure>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Grid;
