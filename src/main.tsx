import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('main.tsx loaded');

function mountApp() {
	const rootEl = document.getElementById('root');
	console.log('Attempting to mount, root element:', rootEl);
	if (!rootEl) {
		// If root is not yet present (race condition in some test environments), retry a few times
		const retries = 5;
		let attempt = 0;
		const timer = setInterval(() => {
			attempt++;
			const el = document.getElementById('root');
			console.log(`mount retry ${attempt}, root:`, el);
				if (el) {
						clearInterval(timer);
						createRoot(el).render(<App />);
						try { (window as any).__appReady = true; } catch { /* ignore in non-browser env */ }
					} else if (attempt >= retries) {
				clearInterval(timer);
				console.error('Failed to find #root after retries.');
			}
		}, 200);
		return;
	}

	createRoot(rootEl).render(<App />);
	try {
		(window as any).__appReady = true;
		document.body.setAttribute('data-app-ready', 'true');
	} catch { /* ignore in non-browser env */ }
}

mountApp();
