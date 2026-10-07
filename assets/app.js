import { initFeaturedWork } from "./featured-work.js";
import { initStyleDNA } from "./style-dna.js";
import { renderRecognition } from "./recognition.js";
import { initSimulator } from "./simulator.js";
import { initOpening } from "./opening.js";
import { initLanguage } from "./i18n.js";
import { initNavigation } from "./navigation.js";
import { initFinancing } from "./financing.js";
const navigation = initNavigation();
const financing = initFinancing(navigation);
const simulator = initSimulator();
const styleDNA = initStyleDNA();
initLanguage(() => {
  navigation.refresh();
  financing.refresh();
  simulator.refresh();
  styleDNA.refresh();
});
document.querySelector("#current-year").textContent = new Date().getFullYear();

initFeaturedWork();
renderRecognition();
initOpening();
