const ls = {
    getLang() {
        let lang = localStorage.getItem('prodExpLang');
        if(!lang && navigator.language) lang = navigator.language.slice(0, 2);
        lang = { uk: 0, ru: 1, en: 2, ['0']: 0, ['1']: 1, ['2']: 2 }[lang];
        return lang === 0 || lang === 1 || lang === 2 ? lang : 2;
    },

    setLang: lang => localStorage.setItem('prodExpLang', lang),

    getSettings() {
        let settings;
        const defaults = [
            ['header', ['Закупівля', 'Покупки', 'Purchases']],
            ['useCustomUnits', false],
            ['units', [ ['кг', 'кг', 'kg'], ['шт', 'шт', 'pcs'] ] ],
        ];
        try {
            settings = JSON.parse(localStorage.getItem('prodExpSettings')) || {};
        } catch(err) {
            settings = {};
        }
        for(const [param, defaultVal] of defaults) {
            const p = settings[param];
            if(!p || (param === 'units' && !settings.useCustomUnits)) {
                settings[param] = defaultVal;
            } else if(Array.isArray(p)) {
                if(!p.length) settings[param] = defaultVal;
                else if(param === 'header') settings.header = p.map((h, i) => h || defaultVal[i]);
            }
        }
        return settings;
    },

    setSettings: settings => localStorage.setItem('prodExpSettings', JSON.stringify(settings)),

    getLastUsed() {
        try {
            const parsed = JSON.parse(localStorage.getItem('prodExpLastUsed'));
            return (parsed instanceof Object) ? parsed : {};
        } catch(err) {
            return {};
        }
    },

    setLastUsed: obj => localStorage.setItem('prodExpLastUsed', JSON.stringify(obj)),

    getProducts() {
        try {
            const parsed = JSON.parse(localStorage.getItem('prodExpArray'));
            return Array.isArray(parsed) ? parsed : [];
        } catch(err) {
            return [];
        }
    },

    setProducts: products => localStorage.setItem('prodExpArray', JSON.stringify(products)),

    clearProducts: () => localStorage.removeItem('prodExpArray'),

    getDatalist() {
        try {
            const parsed = JSON.parse(localStorage.getItem('prodExpDatalist'));
            return Array.isArray(parsed) ? parsed : [];
        } catch(err) {
            return [];
        }
    },

    setDatalist: arr => localStorage.setItem('prodExpDatalist', JSON.stringify(arr)),

    downloadSettingsFile() {
        const obj = {};
        ['prodExpLang', 'prodExpSettings', 'prodExpDatalist', 'prodExpLastUsed']
        .forEach(item => obj[item] = localStorage.getItem(item));
        const blob = new Blob([JSON.stringify(obj)], { type : 'application/json' });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        const d = new Date(), year = d.getFullYear(), month = 1 + d.getMonth(), day = d.getDate();
        const toString = dayOrMonth => `${dayOrMonth < 10 ? '0' : ''}${dayOrMonth}`;
        a.download = `_settings-${year}-${toString(month)}-${toString(day)}.json`;
        a.click();
    },

    uploadSettingsFile(fileInputElement) {
        const reader = new FileReader();
        reader.onload = () => {
            const obj = JSON.parse(reader.result);
            ['prodExpLang', 'prodExpSettings', 'prodExpDatalist', 'prodExpLastUsed']
            .forEach(item => localStorage.setItem(item, obj[item]));
            window.location.reload();
            alert('Відновлення налаштувань було успішним!')
        }
        try {
            reader.readAsText(fileInputElement.files[0]);
        } catch(err) {
            alert('Error happenned while reading file!', err);
        }
    }
};

export default ls;