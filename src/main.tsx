import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'log': {
      console.log("log", ...data.payload.args);
      break;
    }
    default:
      console.log('error', 'Unhandled message:', data.type);
  }
});

console.log('client started with worker', worker);
