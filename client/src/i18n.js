import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { english, finnish, swedish } from './translations';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'Finnish',
    resources: {
      en: english,
      fi: finnish,
      swe: swedish
    }
});


export default i18n;