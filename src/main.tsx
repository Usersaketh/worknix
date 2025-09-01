import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import { Analytics } from './Analytics'
import './index.css'

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<ErrorBoundary>
			<App />
			<Analytics />
			<script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
			  '@context': 'https://schema.org',
			  '@type': 'Organization',
			  name: 'Worknix',
			  url: typeof location !== 'undefined' ? location.origin : 'https://example.com',
			  logo: 'https://lovable.dev/opengraph-image-p98pqg.png'
			}) }} />
		</ErrorBoundary>
	</HelmetProvider>
);

// Register service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').then(reg => {
			// Detect new SW waiting
			function showUpdateToast() {
				// Dynamic import toast to avoid pulling it into initial chunk if App didn't mount toasts yet.
				import('./hooks/use-toast').then(m => {
					m.toast({
						title: 'Update available',
						description: 'A new version is ready. Reload to apply.',
						action: React.createElement('button', { className: 'text-xs underline ml-2', onClick: () => window.location.reload() }, 'Reload')
					});
				}).catch(()=>{});
			}
				if (reg.waiting) {
				showUpdateToast();
			} else if (reg.installing) {
					reg.installing.addEventListener('statechange', () => { if (reg.waiting) showUpdateToast(); });
			}
			reg.addEventListener('updatefound', () => {
				const newWorker = reg.installing;
					if (newWorker) newWorker.addEventListener('statechange', () => { if (newWorker.state === 'installed' && reg.waiting) showUpdateToast(); });
			});
		}).catch(() => {});
	});
}
