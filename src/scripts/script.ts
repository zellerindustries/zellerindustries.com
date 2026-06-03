/* ===============================
   LANGUAGE REDIRECT WITH COOKIE
   ===============================

((): void => {
    const COOKIE_NAME = 'site_lang';
    const COOKIE_DAYS = 365;

    const supportedLangs: string[] = ['it', 'en'];

    const pathParts: string[] = window.location.pathname.split('/').filter(Boolean);
    const currentLang: string = pathParts[0] || '';
    const isRoot: boolean = pathParts.length < 1;

    // COOKIE HELPERS
    function getCookie(name: string): string | undefined {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    }

    function setCookie(name: string, value: string, days: number): void {
        const expires: string = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }

    // 1. COOKIE FIRST
    const savedLang: string | undefined = getCookie(COOKIE_NAME);
    let selectedLang: string = 'en';

    if (savedLang && supportedLangs.includes(savedLang)) {
        selectedLang = savedLang;
    } else {
        // 2. BROWSER DETECTION
        const browserLangs: readonly string[] = navigator.languages || [navigator.language];

        for (const entry of browserLangs) {
            const [lang, region] = entry.toLowerCase().split('-');
            const upperRegion: string | undefined = region?.toUpperCase();

            if (supportedLangs.includes(lang)) {
                selectedLang = lang;
                break;
            }
        }

        // save detected language
        setCookie(COOKIE_NAME, selectedLang, COOKIE_DAYS);
    }

    // 3. REDIRECT ONLY IF NEEDED
    if (currentLang !== selectedLang) {
        const destPath: string = isRoot
            ? `/${selectedLang}/`
            : `/${selectedLang}/${pathParts.slice(1).join('/')}`;

        window.location.replace(destPath);
    }
})();*/