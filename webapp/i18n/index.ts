import * as de from './de.json';
import * as en from './en.json';
import * as es from './es.json';
import * as fr from './fr.json';
import * as ru from './ru.json';

export function getTranslations(locale: string): {[key: string]: string} {
    switch (locale) {
    case 'de':
        return de;
    case 'fr':
        return fr;
    case 'en':
        return en;
    case 'es':
        return es;
    case 'ru':
        return ru;
    }
    return {};
}

