import { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';

function App() {
  const [error, setError] = useState('');
  const [txs, setTxs] = useState([]);
  const [amount, setAmount] = useState('0.000001');

  const startPayment = async ({ ether, addr }) => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      ethers.getAddress(addr);

      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.parseEther(ether),
      });

      setTxs([tx]);

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const onEthPay = async () => {
    try {
      const paymentSuccessful = await startPayment({
        ether: amount,
        addr: '0x5BfD12B7310621d2A1EE0773a4c2E728C79cdd9b',
      });

      if (paymentSuccessful) {
        alert('Payment Successful!');
      } else {
        alert('Payment Failed');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="card">
          <img src="https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400" className="card-img-top" alt="Product" />
          <div className="card-body">
            <h5 className="card-title">Pizza</h5>
            <p className="card-text">Price: {amount} ETH</p>
            <button className="btn" onClick={onEthPay}>
              Pay with ETH
            </button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {txs.length > 0 && (
          <div className="transaction-details">
            <h5>Transaction Details:</h5>
            <pre>{JSON.stringify(txs, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
