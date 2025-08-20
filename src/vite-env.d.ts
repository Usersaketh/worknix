/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_ADS?: string;
	readonly VITE_ADSENSE_CLIENT_ID?: string; // e.g., ca-pub-xxxxxxxxxxxxxxxx
	readonly VITE_ADSENSE_SLOT_HOME?: string;
	readonly VITE_ADSENSE_SLOT_JOBS?: string;
	readonly VITE_ADSENSE_SLOT_GOVT?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
