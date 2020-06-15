import * as en from './en.json';
import * as es from './es.json';
import * as fr from './fr.json';

export function getTranslations(locale: string): {[key: string]: string} {
    switch (locale) {
    case 'fr':
        return fr;
    case 'en':
        return en;
    case 'es':
        return es;
    }
    return {};
}

