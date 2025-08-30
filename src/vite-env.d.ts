/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_ADS?: string;
	readonly VITE_ADSENSE_CLIENT_ID?: string; // e.g., ca-pub-xxxxxxxxxxxxxxxx
	readonly VITE_ADSENSE_SLOT_HOME?: string;
	readonly VITE_ADSENSE_SLOT_JOBS?: string;
	readonly VITE_ADSENSE_SLOT_GOVT?: string;
	readonly VITE_NOTIFICATIONS_URL?: string;
	readonly VITE_ADMIN_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
