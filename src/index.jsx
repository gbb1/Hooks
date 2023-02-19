import React from 'react';
import { createRoot } from 'react-dom/client';

const app = createRoot(document.getElementById('app'));

// Huzzah for jsx!
function App() {
  console.log('testing');

  return (
    <div>
      <h1>TEST</h1>
    </div>
  );
}

app.render(<App />);
