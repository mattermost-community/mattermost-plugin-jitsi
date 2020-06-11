import * as en from './en.json';
import * as es from './es.json';

export function getTranslations(locale: string): {[key: string]: string} {
    switch (locale) {
    case 'en':
        return en;
    case 'es':
        return es;
    }
    return {};
}

