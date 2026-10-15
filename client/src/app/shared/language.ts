import { effect, Service, signal } from '@angular/core';

export const LANGUAGES = [
    'en_US',
    'bg_BG',
    'de_DE',
    'hr_HR',
    'mk_MK',
] as const;

export type Language = typeof LANGUAGES[number];


@Service()
export class LanguageService {

    readonly language = signal<Language>('en_US');

    constructor() {
        const saved = localStorage.getItem('language');

        if (LANGUAGES.some(lang => lang === saved)) {
            this.language.set(saved as Language);
        }

        effect(() => {
            localStorage.setItem('language', this.language());
        });
    }

    setLanguage(language: Language): void {
        this.language.set(language);
    }

    getLanguage(): Language {
        return this.language();
    }

    toggleLanguage(): void {
        this.language.update(current => {
            const index = LANGUAGES.indexOf(current);
            return LANGUAGES[(index + 1) % LANGUAGES.length];
        });
    }
}
