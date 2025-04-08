import React, { useState, useEffect } from "react";

const Counter: React.FC = () => {
  console.log('renderizar')
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    console.log(`O contador está em: ${count}`);
  }, [count]);

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        Incrementar
      </button>
    </div>
  );
};

export default Counter;
