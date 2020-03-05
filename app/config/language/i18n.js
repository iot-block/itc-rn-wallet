import I18n, { getLanguages } from 'react-native-i18n';

import en from './en.json';
import zh from './zh.json';
import ko from './ko.json';
import de from './de.json';
import es from './es.json';
import nl from './nl.json';
import fr from './fr.json';
import ru from './ru.json';
import uk from './uk.json';

I18n.fallbacks = true;

I18n.defaultLocale = 'en';

I18n.translations = {
  en,
  zh,
  ko,
  de,
  es,
  nl,
  fr,
  ru,
  uk,
};

export { I18n, getLanguages };
