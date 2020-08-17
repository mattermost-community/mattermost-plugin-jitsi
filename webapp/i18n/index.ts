import * as de from './de.json';
import * as en from './en.json';
import * as es from './es.json';
import * as fr from './fr.json';
import * as it from './it.json';
import * as ja from './ja.json';
import * as ko from './ko.json';
import * as nl from './nl.json';
import * as pl from './pl.json';
import * as pt_BR from './pt_BR.json';
import * as ro from './ro.json';
import * as ru from './ru.json';
import * as tr from './tr.json';
import * as uk from './uk.json';
import * as zh_Hans from './zh_Hans.json';
import * as zh_Hant from './zh_Hant.json';

export function getTranslations(locale: string): {[key: string]: string} {
    switch (locale) {
    case 'de':
        return de;
    case 'en':
        return en;
    case 'es':
        return es;
    case 'fr':
        return fr;
    case 'it':
        return it;
    case 'ja':
        return ja;
    case 'ko':
        return ko;
    case 'nl':
        return nl;
    case 'pl':
        return pl;
    case 'pt-BR':
        return pt_BR;
    case 'ro':
        return ro;
    case 'ru':
        return ru;
    case 'tr':
        return tr;
    case 'uk':
        return uk;
    case 'zh-CN':
        return zh_Hans;
    case 'zh-TW':
        return zh_Hant;
    }
    return {};
}

