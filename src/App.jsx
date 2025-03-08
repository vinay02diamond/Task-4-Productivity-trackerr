/* global chrome */
import React, { useEffect, useState } from 'react';
import './App.css';

const formatTime = (ms) => {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  let formattedTime = `${seconds}s`;
  if (minutes > 0) { formattedTime = `${minutes}m ${formattedTime}`; }
  if (hours > 0) { formattedTime = `${hours}h ${formattedTime}`; }
  return formattedTime;
};

function App() {
  const [times, setTimes] = useState({});
  const [blockedSites, setBlockedSites] = useState(['https://www.facebook.com/']);

  useEffect(() => {
    const fetchTimes = () => {
      chrome.runtime.sendMessage({ type: 'getTimes' }, (response) => {
        setTimes(response);
      });
    };

    fetchTimes();
    const intervalId = setInterval(fetchTimes, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const generateReport = () => {
    console.log("Report generated!");
    alert("Report generated successfully!");
  };

  const addBlockedSite = () => {
    const site = prompt("Enter a site to block (e.g., https://example.com):");
    if (site) {
      setBlockedSites([...blockedSites, site]);
      chrome.runtime.sendMessage({ type: 'addBlockedSite', site });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Productivity Tracker</h1>
        <ul>
          {Object.entries(times).map(([domain, time]) => (
            <li key={domain}>
              <span>{domain}</span>
              <span>{formatTime(time)}</span>
            </li>
          ))}
        </ul>
        <button onClick={generateReport} className="generate-report-btn">
          Generate Report
        </button>
        <button onClick={addBlockedSite} className="blocked-sites-btn">
          Blocked Sites List
        </button>
      </header>
    </div>
  );
}

export default App;