import { MOODBOARDS, MATERIAL_PALETTES } from "./data.js";
export function initShowroom(scenes, openModal) {
  let activeMoodboardIdx = 0,
    activeFinishingIdx = 0,
    activeMaterial = MATERIAL_PALETTES.architect[0],
    cart = [],
    isCartOpen = false;
  function renderMoodboardUI() {
    const nav = document.getElementById("moodboard-nav");
    const details = document.getElementById("moodboard-details");
    const b = MOODBOARDS[activeMoodboardIdx];

    // Render Nav
    nav.innerHTML = MOODBOARDS.map(
      (board, idx) => `
                <button data-action="changeMoodboard" data-args="${idx}" class="text-left p-4 border transition-all uppercase tracking-widest text-xs md:text-sm font-bold flex justify-between items-center cursor-hover ${activeMoodboardIdx === idx ? "border-white bg-white text-black pl-6" : "border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white"}">
                    <span>${String(idx + 1).padStart(2, "0")} // ${board.name}</span>
                    ${activeMoodboardIdx === idx ? '<span class="animate-pulse">●</span>' : ""}
                </button>
            `,
    ).join("");

    // Render Details
    details.innerHTML = `
                <div class="absolute -right-12 -top-12 text-[120px] font-black text-zinc-900 leading-none opacity-50 select-none pointer-events-none">
                    ${String(activeMoodboardIdx + 1).padStart(2, "0")}
                </div>
                <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 relative z-10">${b.name}</p>
                <h4 class="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6 relative z-10">${b.style}</h4>
                <p class="text-sm md:text-base text-zinc-400 font-medium max-w-lg leading-relaxed relative z-10">${b.desc}</p>
                <div class="mt-8 flex gap-4 relative z-10">
                    <button data-action="enterShowroom" data-args="${activeMoodboardIdx}" class="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-hover">Enter Showroom</button>
                    <button data-action="technicalSpecs" class="px-6 py-3 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-colors cursor-hover">Technical Specs</button>
                </div>
            `;

    // GSAP pop animation
  }

  function changeMoodboard(idx) {
    activeMoodboardIdx = idx;
    scenes.camera(idx);
    renderMoodboardUI();

    // Update custom cursor targeting for new buttons
  }

  function enterShowroom(idx) {
    activeFinishingIdx = idx;
    const b = MOODBOARDS[activeFinishingIdx];

    // Check if material from this board is already in cart, if so, select it
    const cartItem = cart.find((i) => i.boardId === b.id);
    activeMaterial = cartItem ? cartItem.material : MATERIAL_PALETTES[b.id][0];

    renderFinishingUI();
    scenes.material(activeMaterial);

    document
      .getElementById("finishing-studio")
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
  }

  function renderFinishingUI() {
    const tabs = document.getElementById("archetype-tabs");
    const list = document.getElementById("material-list");
    const b = MOODBOARDS[activeFinishingIdx];
    const palette = MATERIAL_PALETTES[b.id];

    document.getElementById("vignette-subtitle").innerText = b.name;
    document.getElementById("vignette-title").innerText = b.style;

    // Render Tabs
    tabs.innerHTML = MOODBOARDS.map((board, idx) => {
      const inCart = cart.some((item) => item.boardId === board.id);
      return `
                <button data-action="enterShowroom" data-args="${idx}" class="px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all relative cursor-hover ${activeFinishingIdx === idx ? "border-white bg-white text-black" : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"}">
                    ${board.name}
                    ${inCart ? `<span class="ml-2 ${activeFinishingIdx === idx ? "text-zinc-600" : "text-white"}">✓</span>` : ""}
                </button>`;
    }).join("");

    // Render Material List
    list.innerHTML = palette
      .map(
        (mat) => `
                <button data-action="selectMaterial" data-args="${mat.id}" class="p-5 border text-left transition-all group flex justify-between items-center cursor-hover ${activeMaterial.id === mat.id ? "border-white bg-zinc-900" : "border-zinc-800 hover:border-zinc-500"}">
                    <div>
                        <h4 class="text-lg font-bold uppercase tracking-widest ${activeMaterial.id === mat.id ? "text-white" : "text-zinc-400 group-hover:text-white"}">${mat.name}</h4>
                        <p class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">${mat.type}</p>
                    </div>
                    <div class="w-8 h-8 rounded-full border border-zinc-700" style="background-color: #${mat.color.toString(16).padStart(6, "0")}"></div>
                </button>
            `,
      )
      .join("");

    const btn = document.getElementById("btn-add-cart");
    btn.innerText = `Add to Cart // ${activeMaterial.name}`;
  }

  function selectMaterial(matId) {
    const b = MOODBOARDS[activeFinishingIdx];
    activeMaterial = MATERIAL_PALETTES[b.id].find((m) => m.id === matId);
    renderFinishingUI();
    scenes.material(activeMaterial);
  }

  // --- CART LOGIC ---
  function addToCart() {
    const b = MOODBOARDS[activeFinishingIdx];
    cart = cart.filter((item) => item.boardId !== b.id);
    cart.push({ boardId: b.id, boardName: b.name, material: activeMaterial });

    const btn = document.getElementById("btn-add-cart");
    btn.innerHTML = `<span class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Added to Cart</span>`;

    updateCartUI();
    renderFinishingUI(); // refresh checkmarks
  }

  function toggleCart() {
    isCartOpen = !isCartOpen;
    const drawer = document.getElementById("cart-drawer");
    drawer.inert = !isCartOpen;
    drawer.setAttribute("aria-hidden", String(!isCartOpen));
    if (isCartOpen) {
      drawer.classList.remove("translate-x-full");
      drawer.classList.add("translate-x-0");
      updateCartUI();
    } else {
      drawer.classList.remove("translate-x-0");
      drawer.classList.add("translate-x-full");
    }
  }

  function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.length;
    const indicator = document.getElementById("cart-indicator");
    cart.length > 0
      ? indicator.classList.remove("hidden")
      : indicator.classList.add("hidden");

    const list = document.getElementById("cart-items");
    const footer = document.getElementById("cart-footer");

    if (cart.length === 0) {
      list.innerHTML = `<p class="text-zinc-500 font-mono text-sm uppercase tracking-widest text-center mt-12">Your cart is empty.</p>`;
      footer.classList.add("hidden");
    } else {
      list.innerHTML = cart
        .map(
          (item) => `
                    <div class="p-4 border border-zinc-800 bg-zinc-900 flex justify-between items-center">
                        <div>
                            <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">${item.boardName}</p>
                            <h4 class="text-sm font-bold uppercase tracking-widest text-white">${item.material.name}</h4><button data-action="removeMaterial" data-args="${item.boardId}" class="text-xs underline mt-3" aria-label="Remove ${item.boardName} from shortlist">Remove</button>
                        </div>
                        <div class="w-6 h-6 rounded-full border border-zinc-700 shrink-0" style="background-color: #${item.material.color.toString(16).padStart(6, "0")}"></div>
                    </div>
                `,
        )
        .join("");
      footer.classList.remove("hidden");
    }
  }

  function buildDesignBrief() {
    if (isCartOpen) toggleCart();
    document
      .getElementById("onboarding")
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
  }

  renderMoodboardUI();
  renderFinishingUI();
  updateCartUI();
  const drawer = document.querySelector("#cart-drawer");
  drawer.inert = true;
  drawer.setAttribute("aria-hidden", "true");
  return {
    removeMaterial(id) {
      cart = cart.filter((item) => item.boardId !== id);
      updateCartUI();
      renderFinishingUI();
    },
    changeMoodboard,
    enterShowroom,
    selectMaterial,
    addToCart,
    toggleCart,
    buildDesignBrief,
    technicalSpecs() {
      const board = MOODBOARDS[activeMoodboardIdx];
      openModal({
        title: board.name,
        subtitle: board.style,
        body: `<p>${board.desc}</p><p class="mt-6">Finish palette: ${MATERIAL_PALETTES[board.id].map((m) => m.name).join(", ")}. These are visual concepts; final product specifications are confirmed during consultation.</p>`,
      });
    },
    getSelections() {
      return cart
        .map((item) => `${item.boardName}: ${item.material.name}`)
        .join("; ");
    },
    closeCart() {
      if (isCartOpen) toggleCart();
    },
  };
}
