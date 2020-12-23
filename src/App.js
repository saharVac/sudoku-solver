import Header from './components/Header';
import Board from "./components/Board"
import './App.css';
import Choices from './components/Choices';
import Solve from "./components/Solve"
import { useState } from 'react';

function App() {

  const [solving, setSolving] = useState(false)

  const solve = () => {
    setSolving(true)
  }

  return (
    <div className="App">
      <Header />
      <Board isSolving={solving} />
      <Choices />
      <Solve solve={solve} />
    </div>
  );
}

export default App;
