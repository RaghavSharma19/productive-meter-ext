import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import data1 from './data.json';
import './App.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  // State for existing website data and new website input
  const [webpageData, setWebpageData] = useState(data1.webpageData);
  const [newWebsite, setNewWebsite] = useState('');

  // Prepare chart labels and durations from state
  const labels = webpageData.map((item) => item.title);
  const durations = webpageData.map((item) => (item.duration / 3600).toFixed(2));

  // ChartJS data object
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

  // Inline style objects
  const inputGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '16px 0'
  };

  const inputFieldStyle = {
    flex: 1,
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  const addButtonStyle = {
    padding: '8px 12px',
    fontSize: '16px',
    backgroundColor: '#36A2EB',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Function to add a new website entry
  const addNewWebsite = () => {
    if (!newWebsite.trim()) return; // Prevent empty entries
    const newEntry = { title: newWebsite.trim(), duration: 0 };
    setWebpageData([...webpageData, newEntry]);
    setNewWebsite('');
  };

  // Delete a website entry by index
  const deleteEntry = (index) => {
    const updatedData = [...webpageData];
    updatedData.splice(index, 1);
    setWebpageData(updatedData);
  };

  // Reset all durations to 0
  const resetData = () => {
    const resetData = webpageData.map(entry => ({
      ...entry,
      duration: 0
    }));
    setWebpageData(resetData);
  };

  return (
    <div>
      <h2>Time Spent on Websites</h2>
      {/* Input and add button */}
      <div style={inputGroupStyle}>
        <input 
          placeholder="Add websites to track" 
          style={inputFieldStyle}
          value={newWebsite}
          onChange={(e) => setNewWebsite(e.target.value)}
        />
        <button style={addButtonStyle} onClick={addNewWebsite}>
          <i className="bi bi-cloud-plus"></i>
        </button>
      </div>

      {/* Chart */}
      <div style={{ width: '400px', margin: 'auto' }}>
        <Pie data={chartData} />
      </div>

      {/* List of website entries with Delete option */}
      <div style={{ marginTop: '16px' }}>
        {webpageData.map((element, index) => (
          <div 
            key={index} 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '8px 0', 
              borderBottom: '1px solid #ccc'
            }}
          >
            <p style={{ margin: 0 }}>
              {element.title} - {(element.duration / 3600).toFixed(2)} hours
            </p>
            <button 
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
              onClick={() => deleteEntry(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Reset Data Button */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button 
          style={{
            background: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
          onClick={resetData}
        >
          Reset Data
        </button>
      </div>
    </div>
  );
}

export default App;
