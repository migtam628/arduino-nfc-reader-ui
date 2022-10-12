/* eslint-disable react/button-has-type */
import { useState, useRef } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { serialHandler as serial } from './serial-handler';

const Reader = () => {
  const [command, setCommand] = useState('');
  const [res, setRes] = useState('');
  const resRef = useRef(null);

  // let response = '';
  const [value, setValue] = useState([]);
  const [log, setLog] = useState([]);

  var port = serial.port;

  async function handleRead() {
    var _read = true;
    while (_read) {
      await serial.read().then((r) => {
        setRes(' \n' + r);
        if (r.includes('Done')) {
          console.log('Done');
          _read = false;
        }
      });
    }
  }

  async function handleConnect() {
    await serial.init().then((r) => {
      handleRead();
      return r;
    });
  }

  async function handleDisconnect() {
    await serial.disconnect().then(() => {
      port = {};
    });
  }

  async function handleSend() {
    await serial.write(command).then((r) => {
      console.log(r);
      handleRead();
      setCommand('');
    });
  }

  async function handleReadNFC() {
    await serial.write('read').then((r) => {
      handleRead();
    });
  }

  async function handleDeleteNFC() {
    await serial.write('delete').then((r) => {
      handleRead();
    });
  }

  return (
    <div className="App">
      <div className="title">
        <h2>NFC Reader UI</h2>
      </div>
      <div className="subTitle">
        <h5>Mega2560 Connected</h5>
        <button
          onClick={port ? handleDisconnect : handleConnect}
          className="button"
        >
          {port ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      <div className="buttons">
        <div className="subButtons">
          <button onClick={handleReadNFC} className="button">
            Read
          </button>
          <button onClick={handleDeleteNFC} className="button">
            Erase
          </button>
        </div>
        <div className="inputDiv">
          <input
            type="text"
            className="input"
            value={command}
            onChange={(e) => setCommand(e.currentTarget.value)}
          />
          <button onClick={handleSend} className="button">
            Send
          </button>
        </div>
      </div>
      <div className="log">
        <div className="logTitle">
          <h5>Log</h5>
          {/* <button
          disabled={log.length === 0}
          className="button saveBtn"
          onClick={() => saveStringToFile(res)}
        >
          Save
        </button> */}
        </div>

        <div className="logContentDiv">
          <div className="logContent">
            {log.map((item, index) => {
              return <p key={index}>{item}</p>;
            })}
          </div>
        </div>
      </div>
      <div className="res">
        <div className="resTitle">
          <h5>Response</h5>
          <button
            disabled={value.length === 0}
            className="button saveBtn"
            onClick={() => saveArrayToFile(value)}
          >
            Save
          </button>
        </div>

        <div ref={resRef} className="response">
          {value.map((item, index) => {
            return <p key={index}>{item}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reader />} />
      </Routes>
    </Router>
  );
}

// grab and array of strings and save them in a text file locally
function saveArrayToFile(array: any[]) {
  var blob = new Blob(array, { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'res.txt');
}

function saveAs(blob: any, fileName: any) {
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
