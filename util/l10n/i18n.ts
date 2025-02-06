import { I18n } from 'i18n-js';
import de from "./app_de.json";
import en from "./app_en.json";
import fa from "./app_fa.json";
import it from "./app_it.json";
import tr from "./app_tr.json";
import zh from "./app_zh.json";

// Set the key-value pairs for the different languages you want to support.
export const i18n = new I18n({
  de,
  en,
  fa,
  it,
  tr,
  zh,
});

export const languages = [
  { value: "zh", title: "中文" },
  { value: "en", title: "English" },
  { value: "de", title: "Germany" },
  { value: "it", title: "Italy" },
  { value: "fa", title: "France" },
  { value: "tr", title: "Turkish" }
] as const