// IDIOMAS
document.addEventListener('DOMContentLoaded', async () => {
    const getUserLanguage = () => {
        const savedLang = localStorage.getItem('site-lang');
        if(savedLang) return savedLang;

        const browserLang = navigator.language || navigator.userLanguage;
        if(browserLang && browserLang.startsWith('en')) return 'en';
        return 'pt'; 
    };

    let currentLang = getUserLanguage();

    const loadTranslations = async (lang) => {
        try{
            const response = await fetch(`/assets/lang/${lang}.json`, { cache: 'no-cache' });
            if(!response.ok) throw new Error(`Erro ao carregar idioma: ${lang}`);
            return await response.json();
        }catch(error){
            console.error("Falha na tradução:", error);
            return null;
        }
    };

    const applyTranslations = (translations) => {
        if(!translations) return;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if(translations[key]){
                element.textContent = translations[key];
            }
        });
    };

    const setLanguage = async (lang) => {
        const translations = await loadTranslations(lang);
        if(translations){
            applyTranslations(translations);
            localStorage.setItem('site-lang', lang);
            currentLang = lang;

            const btn = document.getElementById('button-lang');
            if(btn){
                const label = lang === 'pt' ? 'PT-BR' : 'EN-US';
                btn.innerHTML = `<span class="button-lang-icon">🌐</span> ${label}`;
            }
        }
    };

    await setLanguage(currentLang);

    const langBtn = document.getElementById('button-lang');
    if(langBtn){
        const label = currentLang === 'pt' ? 'PT-BR' : 'EN-US';
        langBtn.innerHTML = `<span class="button-lang-icon">🌐</span> ${label}`;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';
        
        const languages = [
            { code: 'en', label: 'ENGLISH' },
            { code: 'pt', label: 'PORTUGUÊS (BRASIL)' }
        ];

        languages.forEach(lang => {
            const item = document.createElement('div');
            item.className = 'lang-dropdown-item';
            item.textContent = lang.label;
            item.addEventListener('click', () => {
                setLanguage(lang.code);
                dropdown.classList.remove('show');
            });
            dropdown.appendChild(item);
        });

        langBtn.parentNode.insertBefore(dropdown, langBtn.nextSibling);

        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== langBtn) {
                dropdown.classList.remove('show');
            }
        });
    }
});