import logo from './logo.svg';
import './App.css';
import CypherService from './services/CypherService';
import CryptoJS from 'crypto-js'; // Import the crypto-js library
import { useEffect, useState } from 'react';


function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await CypherService.getEncryptedData();
      const _data = result.map((item) => {
        const { encryptedSymmetricKey, publicKey, encrypted } = item;
        const symmetricKey = CryptoJS.AES.decrypt(encryptedSymmetricKey, publicKey).toString(CryptoJS.enc.Utf8);
        const parts = encrypted.split(':');
        const iv = CryptoJS.enc.Hex.parse(parts[0]);
        const encryptedText = parts[1];
        const decrypted = CryptoJS.AES.decrypt(encryptedText, symmetricKey, {
          iv: iv,
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decryptedData)
      });
      setData(_data);
    }
    fetchData();
  }, [])
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
