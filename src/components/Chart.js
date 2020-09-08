// Libs
import React, { Component } from 'react';
import { Bar, defaults } from 'react-chartjs-2';

defaults.global.maintainAspectRatio = false;

class Chart extends Component {
  state = {
    chartData: {
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'Population',
          data: [
            123445,
            879703,
            398794,
            837983,
            397393
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 1, 0.6)'
          ]
        }
      ]
    }
  };

  render() {
    return (
      <div className="container_chart">
        <Bar 
          data={this.state.chartData}
          // width={50}
          // height={300}
          // options={{
          //   maintainAspectRatio: false
          // }}
        />
      </div>
    );
  }
}

export default Chart;
