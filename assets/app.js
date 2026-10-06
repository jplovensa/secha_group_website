import { renderRecognition } from "./recognition.js";
import { initSimulator } from "./simulator.js";
import { initOpening } from "./opening.js";
import { initLanguage } from "./i18n.js";
import { initNavigation } from "./navigation.js";
import { initFinancing } from "./financing.js";
const navigation = initNavigation();
const financing = initFinancing(navigation);
const simulator = initSimulator((trigger) => financing.open(trigger));
initLanguage(() => {
  navigation.refresh();
  financing.refresh();
  simulator.refresh();
});
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderRecognition();
initOpening();
