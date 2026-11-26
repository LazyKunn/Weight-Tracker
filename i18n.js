// i18n = "internationalization" (i + 18 letters + n).
// Picks the language, translates texts with t("key") and updates the HTML.
//
// In the HTML, mark texts with:
//   data-i18n="key"              -> replaces the element's text
//   data-i18n-placeholder="key"  -> replaces the placeholder of an <input>
//   data-i18n-aria-label="key"   -> replaces the aria-label (text read by screen readers)

window.I18N = (function(){
  "use strict";

  const LANG_KEY = "wt_language_v1";
  const DEFAULT_LANG = "en";
  const locales = window.LOCALES || {};

  // 1) language saved in Settings  2) phone/browser language  3) English
  function detectLanguage(){
    try{
      const saved = localStorage.getItem(LANG_KEY);
      if(saved && locales[saved]) return saved;
    }catch(e){ /* storage not available */ }

    const browserLangs = navigator.languages || [navigator.language || ""];
    for(const l of browserLangs){
      const code = String(l).toLowerCase().split("-")[0]; // "pt-PT" -> "pt"
      if(locales[code]) return code;
    }
    return DEFAULT_LANG;
  }

  let current = detectLanguage();

  // Translate a key. Extra values are passed to texts written as functions.
  // If a text is missing in the current language, use English; if missing there too, show the key.
  function t(key, ...args){
    let value = locales[current] && locales[current][key];
    if(value === undefined) value = locales[DEFAULT_LANG] && locales[DEFAULT_LANG][key];
    if(value === undefined) return key;
    return typeof value === "function" ? value(...args) : value;
  }

  // Update every marked element in the page
  function applyToPage(){
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
    });
  }

  function setLanguage(lang){
    if(!locales[lang]) return;
    current = lang;
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){ /* ignore */ }
    applyToPage();
  }

  return {
    t,
    applyToPage,
    setLanguage,
    getLanguage: () => current,
    getLocale: () => t("_locale"),                       // e.g. "en-GB", for dates
    getAvailable: () => Object.keys(locales).map(code => ({ code, name: locales[code]._name })),
    LANG_KEY
  };
})();
