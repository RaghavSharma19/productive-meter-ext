import { useState } from 'react'
import data1 from './data.json'; // Correct way to import JSON
import './App.css'

function App() {

  return (
    <>
     
      {data1.webpageData.map((element, index) => (
        <div key={index}>
          <p>{element.title} - {(element.duration/3600).toFixed(2)} hours </p>
        </div>
      ))}
    
    </>
  );
}

export default App
