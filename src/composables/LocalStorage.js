export default {
    getLang() {
        let lang = localStorage.getItem('prodExpLang');
        if(!lang && navigator.language) lang = navigator.language.slice(0, 2);
        lang = { uk: 0, ru: 1, en: 2, ['0']: 0, ['1']: 1, ['2']: 2 }[lang];
        return lang === 0 || lang === 1 || lang === 2 ? lang : 2;
    },

    setLang: lang => localStorage.setItem('prodExpLang', lang)
}