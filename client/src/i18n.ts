import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ru } from "./resourses/ru";


i18n
  .use(initReactI18next) // Подключаем react-i18next
  .init({
    resources: {
        ru,
    },
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;