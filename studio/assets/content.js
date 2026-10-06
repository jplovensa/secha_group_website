export const MODAL_DATA = {
  "lets-talk": {
    subtitle: "Start a Project",
    title: "Let's Talk",
    body: `
                    <p class="mb-8 leading-relaxed">Ready to transform your space? Leave your details below and our design team will contact you within 24 hours to schedule a consultation.</p>
                    <div class="flex flex-col gap-4">
                        <input type="text" placeholder="Your Name" class="w-full bg-[#050505] border border-zinc-800 p-4 text-white text-sm font-mono focus:border-white outline-none transition-colors">
                        <input type="email" placeholder="Email Address" class="w-full bg-[#050505] border border-zinc-800 p-4 text-white text-sm font-mono focus:border-white outline-none transition-colors">
                        <button data-action="closeModal" data-args="" class="w-full py-4 mt-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors cursor-hover">Send Inquiry</button>
                    </div>
                `,
  },
  "why-we-exist": {
    subtitle: "Why We Exist",
    title: "Bridging the Gap",
    body: `
                    <div class="aspect-video w-full mb-6 overflow-hidden border border-zinc-800">
                        <img src="../assets/project-tropical.jpg" class="w-full h-full object-cover grayscale">
                    </div>
                    <p class="leading-relaxed mb-4">Design shouldn't be an intimidating process reserved for the elite. We established SECHA Studio+ to democratize premium interior architecture.</p>
                    <p class="leading-relaxed">We bridge the gap between abstract dreams and tangible realities, handling everything from spatial psychology to material science so you can simply enjoy the result. Your sanctuary should be effortless.</p>
                `,
  },
  "modern-elegance": {
    subtitle: "Daffa • The Architect of Form",
    title: "Modern Elegance",
    body: `
                    <div class="aspect-[16/9] w-full mb-6 overflow-hidden border border-zinc-800">
                        <img src="../assets/project-minimalist.jpg" class="w-full h-full object-cover grayscale">
                    </div>
                    <p class="leading-relaxed mb-4">For those who love clean lines, clutter-free spaces, and a touch of everyday luxury. Daffa focuses on making your space feel expansive, calm, and effortlessly polished.</p>
                    <p class="leading-relaxed">His approach relies on subtracting the unnecessary, leaving only what is beautiful and purposeful. Think brutalist textures meeting elegant, undeniable proportions.</p>
                `,
  },
  "cozy-functional": {
    subtitle: "Audina • The Soul of Space",
    title: "Cozy & Functional",
    body: `
                    <div class="aspect-[16/9] w-full mb-6 overflow-hidden border border-zinc-800">
                        <img src="../assets/project-luxury.jpg" class="w-full h-full object-cover grayscale">
                    </div>
                    <p class="leading-relaxed mb-4">For those who want their home to feel like a warm hug. Audina blends Japandi warmth with practical, user-first design to create layouts that flow naturally with your daily routine.</p>
                    <p class="leading-relaxed">She emphasizes organic materials, soft indirect lighting, and spatial rhythms that encourage connection, rest, and absolute tranquility.</p>
                `,
  },
};

// The supplied form had no submission endpoint. Offer an explicit contact handoff.
MODAL_DATA["lets-talk"] = {
  subtitle: "Start a project",
  title: "Let's talk",
  body: '<p class="mb-8">Tell us about your space, your goals, and your timeline. Contact the studio directly to discuss availability and scope.</p><div class="flex flex-wrap gap-4"><a class="px-6 py-4 bg-white text-black font-bold" href="https://wa.me/6282174072041" target="_blank" rel="noopener">WhatsApp the studio</a><a class="px-6 py-4 border border-zinc-600" href="mailto:info@sechahomes.com">Email the studio</a></div>',
};
