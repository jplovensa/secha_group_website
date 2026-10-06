export const translations = {
    en: {
      documentTitle: 'SECHA | Design, Finance & Renovation Platform',
      metaDescription: 'SECHA connects design, renovation financing, and coordinated delivery in one bilingual property platform.',
      namePlaceholder: 'Your full name',
      phonePlaceholder: '0812 3456 7890',
      locationPlaceholder: 'Jakarta Selatan',
      copy: 'Copy',
      copied: 'Copied',
      invalidName: 'Please enter your full name.',
      invalidPhone: 'Please enter a valid phone number.',
      invalidLocation: 'Please enter your project location.',
      submitError: 'Please complete all fields before continuing.',
      anotherLead: 'Submit another lead',
      menuOpen: 'Open menu',
      menuClose: 'Close menu'
    },
    id: {
      documentTitle: 'SECHA | Platform Desain, Pembiayaan & Renovasi',
      metaDescription: 'SECHA menghubungkan desain, pembiayaan renovasi, dan pelaksanaan terkoordinasi dalam satu platform properti dwibahasa.',
      namePlaceholder: 'Nama lengkap Anda',
      phonePlaceholder: '0812 3456 7890',
      locationPlaceholder: 'Contoh: Jakarta Selatan',
      copy: 'Salin',
      copied: 'Tersalin',
      invalidName: 'Mohon masukkan nama lengkap Anda.',
      invalidPhone: 'Mohon masukkan nomor telepon yang valid.',
      invalidLocation: 'Mohon masukkan lokasi proyek Anda.',
      submitError: 'Mohon lengkapi semua kolom sebelum melanjutkan.',
      anotherLead: 'Kirim lead lain',
      menuOpen: 'Buka menu',
      menuClose: 'Tutup menu'
    }
  };
export function initLanguage(onChange = () => {}) {
  const setLanguage = (lang) => {
    if (!translations[lang]) return;
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang;
    document.title = translations[lang].documentTitle;
    document.querySelector('#meta-description').content = translations[lang].metaDescription;
    document.querySelectorAll('[data-set-lang]').forEach(button => {
      const active = button.dataset.setLang === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    for (const [id, key] of [['lead-name','namePlaceholder'],['lead-phone','phonePlaceholder'],['lead-location','locationPlaceholder']]) {
      document.getElementById(id).placeholder = translations[lang][key];
    }
    document.querySelectorAll('[data-alt-en]').forEach(image => image.alt = image.dataset[lang === 'id' ? 'altId' : 'altEn']);
    document.querySelector('#copy-lead-id').textContent = translations[lang].copy;
    document.querySelector('#preform .preform__close').setAttribute('aria-label', lang === 'id' ? 'Tutup formulir' : 'Close form');
    document.querySelector('#form-status').textContent = '';
    try { localStorage.setItem('secha_language', lang); } catch {}
    onChange();
  };
  let initial = 'en';
  try { initial = localStorage.getItem('secha_language') === 'id' ? 'id' : 'en'; } catch {}
  setLanguage(initial);
  document.querySelectorAll('[data-set-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.setLang)));
}
export const getLanguage = () => document.body.dataset.lang === 'id' ? 'id' : 'en';
