import { useState } from "react";
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(next, replace = false) {
    setMode(next);
    if(replace){
      setHistory(history.slice(0, - 1));
    }
    history.push(next);
  }
  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      history.pop();
    }
    else{
      setMode(history[0]);
    }
  }

  return { mode, transition, back };
}
