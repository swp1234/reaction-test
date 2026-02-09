// i18n 국제화 로더
class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        this.currentLang = 'ko';
        this.defaultLang = 'ko';
    }

    async init() {
        // localStorage에서 언어 설정 가져오기
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLang = savedLang;
        } else {
            // 브라우저 언어 감지
            const browserLang = this.detectBrowserLanguage();
            if (browserLang) {
                this.currentLang = browserLang;
            }
        }

        await this.loadTranslations(this.currentLang);
        this.updateUI();
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }
        return null;
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) {
                console.warn(`Failed to load ${lang}.json, falling back to default`);
                if (lang !== this.defaultLang) {
                    return this.loadTranslations(this.defaultLang);
                }
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            if (lang !== this.defaultLang) {
                await this.loadTranslations(this.defaultLang);
            }
        }
    }

    t(key, params = {}) {
        let value = this.translations;
        const keys = key.split('.');

        for (const k of keys) {
            value = value[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        // 매개변수 치환
        let result = value;
        for (const [param, val] of Object.entries(params)) {
            result = result.replace(`{${param}}`, val);
        }
        return result;
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        await this.loadTranslations(lang);
        this.updateUI();

        // GA4 언어 변경 추적
        if (window.gtag) {
            gtag('event', 'language_changed', { 'language': lang });
        }
    }

    updateUI() {
        // data-i18n 속성을 가진 모든 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            element.textContent = text;
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageName(lang) {
        const names = {
            'ko': '한국어',
            'en': 'English',
            'zh': '简体中文',
            'hi': 'हिन्दी',
            'ru': 'Русский',
            'ja': '日本語',
            'es': 'Español',
            'pt': 'Português',
            'id': 'Bahasa Indonesia',
            'tr': 'Türkçe',
            'de': 'Deutsch',
            'fr': 'Français'
        };
        return names[lang] || lang;
    }
}

// 전역 i18n 인스턴스
const i18n = new I18n();
