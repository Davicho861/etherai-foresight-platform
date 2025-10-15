import { createRoot } from 'react-dom/client'
// Import global theme shim (re-exports google-theme) to ensure styles are present in tests and runtime
import './styles/gemini.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './styles/praevisio.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

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
				createRoot(el).render(
					<QueryClientProvider client={queryClient}>
						<App />
					</QueryClientProvider>
				);
			} else if (attempt >= retries) {
				clearInterval(timer);
				console.error('Failed to find #root after retries.');
			}
		}, 200);
		return;
	}

	createRoot(rootEl).render(
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	);
}

mountApp();
