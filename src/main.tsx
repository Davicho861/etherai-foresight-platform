import { createRoot } from 'react-dom/client'
import './index.css'

console.log('main.tsx loaded');
console.log('root element:', document.getElementById("root"));
createRoot(document.getElementById("root")!).render(<div>Test</div>);
