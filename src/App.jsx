import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import data1 from './data.json';
import './App.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const labels = data1.webpageData.map((item) => item.title);
  const durations = data1.webpageData.map((item) => (item.duration / 3600).toFixed(2));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Time Spent (Hours)',
        data: durations,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <h2>Time Spent on Websites</h2>
      <div style={{ width: '400px', margin: 'auto' }}>
        <Pie data={chartData} />
      </div>

      {data1.webpageData.map((element, index) => (
        <div key={index}>
          <p>{element.title} - {(element.duration / 3600).toFixed(2)} hours</p>
        </div>
      ))}
    </div>
  );
}

export default App;
