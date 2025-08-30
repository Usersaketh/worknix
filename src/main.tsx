import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</HelmetProvider>
);
