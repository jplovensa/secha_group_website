import { initOpening } from './opening.js';
import { initLanguage } from './i18n.js';
import { initNavigation } from './navigation.js';
import { initFinancing } from './financing.js';
const navigation = initNavigation();
const financing = initFinancing(navigation);
initLanguage(() => { navigation.refresh(); financing.refresh(); });
document.querySelector('#current-year').textContent = new Date().getFullYear();

initOpening();
