const views = [...document.querySelectorAll("[data-view]")];
const viewTriggers = [...document.querySelectorAll("[data-view-target]")];
const navLinks = [...document.querySelectorAll(".nav-link[data-view-target]")];

const allowedViews = ["home", "engine", "saved"];

function normalizeView(value) {
  return allowedViews.includes(value) ? value : "home";
}

function getViewFromHash() {
  return normalizeView(window.location.hash.replace("#", ""));
}

function showView(viewName, updateHash = true) {
  const target = normalizeView(viewName);

  views.forEach((view) => {
    const isTarget = view.dataset.view === target;
    view.hidden = !isTarget;
    view.classList.toggle("is-active", isTarget);
  });

  navLinks.forEach((link) => {
    const isActive = link.dataset.viewTarget === target;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (updateHash) {
    const nextHash = `#${target}`;

    if (window.location.hash !== nextHash) {
      history.pushState({ view: target }, "", nextHash);
    }
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (target === "saved") {
    renderSaved();
  }
}

viewTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    showView(trigger.dataset.viewTarget);
  });
});

window.addEventListener("popstate", () => {
  showView(getViewFromHash(), false);
});

window.addEventListener("hashchange", () => {
  showView(getViewFromHash(), false);
});

const siteHeader = document.getElementById("siteHeader");

function updateHeader() {
  if (!siteHeader) return;

  siteHeader.classList.toggle(
    "is-scrolled",
    window.scrollY > 12
  );
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Datos del generador

const restartEngine = {
  procrastination: {
    label: "PROCRASTINACIÓN",
    actions: [
      "Si te ayuda, dedica cinco minutos a una parte sencilla; también puedes dejarla para después.",
      "Pregúntate qué hace difícil empezar hoy, sin exigirte una respuesta inmediata.",
      "Divide la tarea en una acción pequeña, solo si tienes energía para ella.",
      "Haz una pausa breve y decide después si quieres continuar."
    ]
  },
  blocked: {
    label: "BLOQUEO",
    actions: [
      "Si quieres, escribe en una frase qué te preocupa más ahora.",
      "Anota una decisión que puede esperar y date permiso para posponerla.",
      "Habla con alguien de confianza si te ayudaría ordenar lo que sientes.",
      "Aléjate unos minutos del problema y vuelve solo cuando lo desees."
    ]
  },
  fear: {
    label: "MIEDO A EQUIVOCARME",
    actions: [
      "Si te resulta útil, escribe qué temes y qué necesitarías para sentirte más segura.",
      "Identifica una persona de confianza con quien puedas hablar de la decisión.",
      "Explora qué aspectos son reversibles, sin obligarte a decidir ahora.",
      "Date un momento para respirar y retoma la cuestión cuando te sientas preparada."
    ]
  },
  comparison: {
    label: "COMPARACIÓN",
    actions: [
      "Si quieres, anota algo personal que valoras, aunque parezca pequeño.",
      "Considera descansar un rato de las redes si notas que te afectan.",
      "Pregúntate qué necesitas tú, al margen de las expectativas externas.",
      "Comparte cómo te sientes con alguien de confianza, si te apetece."
    ]
  },
  overwhelmed: {
    label: "SATURACIÓN",
    actions: [
      "Si puedes, aparta la pantalla unos minutos y observa cómo te sientes.",
      "Escribe una cosa que puedes dejar para otro día.",
      "Considera pedir ayuda con alguna responsabilidad, si está a tu alcance.",
      "Elige entre descansar o atender solo lo imprescindible, según lo que necesites."
    ]
  },
  unmotivated: {
    label: "FALTA DE MOTIVACIÓN",
    actions: [
      "Pregúntate si necesitas descanso, compañía o un cambio de actividad.",
      "Si quieres, haz algo agradable sin convertirlo en una obligación.",
      "Permítete dejar una tarea para otro momento sin juzgarte.",
      "Habla con alguien de confianza sobre cómo te sientes, si te ayuda."
    ]
  }
};

const toneProfiles = {
  direct: { label: "DIRECTO" },
  gentle: { label: "SUAVE" },
  powerful: { label: "POTENTE" },
  reflective: { label: "REFLEXIVO" }
};

const messagesByStateAndTone = {
  "procrastination": {
    "direct": [
      "Posponer una tarea no define tu valor. Observa qué te frena y decide si necesitas empezar o hacer una pausa.",
      "Hoy no tienes que demostrar nada. Puedes elegir un paso sencillo o darte tiempo para recuperar claridad. No tienes que forzarte.",
      "Mira qué necesitas de verdad. Empezar poco a poco es válido, y dejar algo para después también lo es. Puedes ir sin prisa.",
      "No confundas una tarea pendiente con tu capacidad. Escucha cómo estás y elige sin añadirte más presión. Puedes ir sin prisa."
    ],
    "gentle": [
      "Puede que hoy empezar cueste más. Trátate con paciencia: tu ritmo merece respeto incluso en días difíciles.",
      "No necesitas reprocharte lo que aún no has hecho. Respira, reconoce tu cansancio y date margen para elegir.",
      "Si una tarea te pesa, no tienes que forzarte. Puedes empezar despacio o permitirte una pausa sin culpa.",
      "Que hoy te cueste comenzar no te hace menos capaz. Escúchate con cariño y atiende primero lo que necesitas."
    ],
    "powerful": [
      "Tu valor no depende de una lista de tareas. Puedes decidir cómo cuidar tu energía y cuándo dar el siguiente paso.",
      "Tienes derecho a marcar tu propio ritmo. Avanzar con calma también es una manera firme de elegir por ti. Puedes ir sin prisa.",
      "No necesitas ganarte el descanso. Puedes sostener tus límites y elegir una acción pequeña cuando te apetezca.",
      "Recuperar tu autonomía también es fuerza. Decide qué merece tu atención y qué puedes dejar para otro momento."
    ],
    "reflective": [
      "Quizá no estés evitando la tarea, sino la presión que la acompaña. ¿Qué cambiaría si te escucharas primero?",
      "Antes de exigirte empezar, observa lo que aparece: cansancio, dudas o miedo. Cada emoción puede darte pistas.",
      "A veces lo difícil no es hacer algo, sino lo que esperamos de nosotros. ¿Qué expectativa podrías revisar hoy?",
      "Detrás de la demora puede haber una necesidad sin atender. Puedes descubrirla antes de decidir cómo seguir."
    ]
  },
  "blocked": {
    "direct": [
      "No necesitas resolverlo todo hoy. Identifica qué te preocupa y decide si quieres explorarlo o esperar.",
      "Tener demasiadas opciones puede agotar. Reduce la presión: una decisión puede esperar mientras recuperas calma.",
      "Estar bloqueada no significa estar fallando. Da nombre a lo que sientes antes de exigirte una respuesta.",
      "La claridad no siempre llega al instante. Puedes ordenar una sola idea y dejar las demás para otro momento."
    ],
    "gentle": [
      "Es comprensible sentirse perdida entre tantas opciones. Date espacio para escucharte sin buscar respuestas rápidas.",
      "No tienes que saberlo todo ahora. Puedes respirar, reconocer tus dudas y confiar en que mereces tiempo. No tienes que correr.",
      "Cuando la mente se llena de preguntas, una pausa también puede ayudarte. No te exijas claridad inmediata.",
      "Quizá hoy necesites más calma que respuestas. Está bien detenerte y retomar el asunto cuando estés preparada."
    ],
    "powerful": [
      "No tener una respuesta inmediata no reduce tu capacidad. Puedes elegir tu ritmo y pedir apoyo si lo necesitas.",
      "La incertidumbre no decide por ti. Tú puedes poner límites a la presión y darte espacio para pensar. No tienes que correr.",
      "No necesitas controlar todas las opciones. Tu fortaleza también está en reconocer lo que puedes dejar pendiente.",
      "Puedes sostener tus dudas sin rendirte ante ellas. Escucha qué importa para ti y elige sin exigirte perfección."
    ],
    "reflective": [
      "Tal vez el bloqueo no pida una solución inmediata. ¿Qué emoción necesita ser reconocida antes de elegir?",
      "Cuando todo parece confuso, quizá convenga distinguir lo urgente de lo que solo genera presión interna.",
      "¿Qué te pesa más: no saber qué hacer o sentir que deberías saberlo? Esa diferencia puede darte claridad. No tienes que correr.",
      "A veces pensar más no ayuda tanto como escucharse. ¿Qué cambiaría si te dieras permiso para esperar?"
    ]
  },
  "fear": {
    "direct": [
      "Equivocarte no determina tu valor. Puedes valorar tus opciones con calma, sin pedirte certeza absoluta. Equivocarse es humano.",
      "Sentir miedo ante una decisión es humano. Revisa lo que sabes y date permiso para elegir cuando quieras. Nadie decide por ti.",
      "No toda decisión exige una respuesta inmediata. Reconoce tus dudas y busca apoyo si te ayuda a aclararlas.",
      "La incertidumbre puede acompañarte sin dirigirte. Decide qué necesitas saber antes de dar cualquier paso. Nadie decide por ti."
    ],
    "gentle": [
      "Tener miedo a equivocarte no te hace menos capaz. Puedes tratar tus dudas con paciencia y comprensión.",
      "Es natural querer acertar. No necesitas cargar con toda la presión: una decisión también puede revisarse.",
      "Tu tranquilidad importa tanto como el resultado. Puedes darte tiempo para escuchar lo que realmente deseas.",
      "Aunque hoy no tengas respuestas, mereces sentirte acompañada. Pedir apoyo también es una posibilidad."
    ],
    "powerful": [
      "Tu capacidad no desaparece cuando dudas. Puedes decidir con tus propios criterios y respetar tus límites.",
      "No necesitas ser perfecta para confiar en ti. Tu voz merece espacio incluso cuando el futuro es incierto. Nadie decide por ti.",
      "El miedo no invalida lo que sabes. Puedes avanzar con cautela o esperar sin convertir esa pausa en fracaso. Nadie decide por ti.",
      "Puedes reconocer el riesgo sin perder tu autonomía. Elegir con calma también demuestra fortaleza personal."
    ],
    "reflective": [
      "Quizá el temor no sea solo equivocarte, sino juzgarte después. ¿Cómo cambiaría la decisión con más amabilidad?",
      "A veces buscamos certeza para sentirnos a salvo. ¿Qué necesitarías para tolerar un poco mejor la incertidumbre?",
      "¿Qué parte de esta decisión depende de ti y cuál no? Distinguirlas puede ayudarte a reducir la presión. Tu voz merece espacio.",
      "Puede que hoy no necesites una respuesta, sino escuchar tus miedos. ¿Qué están intentando proteger?"
    ]
  },
  "comparison": {
    "direct": [
      "Lo que ves de otras personas no cuenta toda su historia. Vuelve a tus necesidades y a tu propio contexto. Tu historia importa.",
      "La trayectoria ajena no es una medida de tu valor. Reconoce tu camino sin convertirlo en una competición.",
      "Compararte puede hacerte perder perspectiva. Observa qué sientes y decide qué referencias te ayudan de verdad.",
      "Tu ritmo no necesita parecerse al de nadie. Puedes admirar otros logros sin utilizarlos para juzgarte. Reconoce tu propia historia."
    ],
    "gentle": [
      "Es humano compararse de vez en cuando. Recuerda que tu historia merece comprensión y su propio espacio.",
      "Si mirar a otras personas te duele, puedes tomar distancia. Tu proceso sigue siendo valioso tal como es. Tu historia importa.",
      "No necesitas llegar al mismo lugar que nadie. Puedes mirar tu camino con más ternura y menos exigencia.",
      "Quizá hoy te haga bien reconocer cuánto has vivido. No tienes que medir tu valor con resultados ajenos. Tu historia importa."
    ],
    "powerful": [
      "Tu camino te pertenece. Ningún logro ajeno puede definir tus capacidades ni el valor de tus decisiones.",
      "No necesitas competir por una vida que no has elegido. Puedes construir tu propia idea de bienestar y éxito.",
      "Tienes derecho a avanzar a tu ritmo. Admirar a alguien no significa renunciar a tus propios criterios. Tu historia importa.",
      "Tu historia no se resume en comparaciones. Decide qué importa para ti y protege el espacio que necesitas."
    ],
    "reflective": [
      "¿Qué buscas al compararte: inspiración, reconocimiento o seguridad? Esa respuesta puede decirte mucho.",
      "Cuando miras el resultado ajeno, quizá olvidas su contexto. ¿Qué partes de tu proceso merecen más atención?",
      "A veces la comparación revela deseos propios. Puedes escucharlos sin convertirlos en una nueva exigencia.",
      "¿Y si el éxito de otra persona no dijera nada sobre tu valor? Tal vez puedas mirar tu historia de otro modo."
    ]
  },
  "overwhelmed": {
    "direct": [
      "No todo necesita tu atención ahora mismo. Reconoce tu cansancio y decide qué puede esperar sin culpa.",
      "Sentirte saturada es una señal para revisar tus límites. Puedes descansar antes de ordenar lo pendiente. Tu pausa es legítima.",
      "No tienes que poder con todo a la vez. Elige lo esencial, pide apoyo o date permiso para hacer una pausa.",
      "Tu bienestar importa más que terminar una lista. Revisa qué necesitas y no añadas más presión a este momento."
    ],
    "gentle": [
      "Cuando todo pesa, es comprensible necesitar una pausa. Trátate con cuidado: no tienes que sostenerlo todo.",
      "Puede que hoy estés haciendo cuanto puedes. Descansar o pedir ayuda también merece un lugar en tu día.",
      "No necesitas justificar tu agotamiento. Puedes bajar el ritmo y atenderte con la misma paciencia que a otros.",
      "Si la mente está llena, respira y date espacio. Lo pendiente puede esperar mientras recuperas un poco de calma."
    ],
    "powerful": [
      "Reconocer tus límites también es valentía. Tienes derecho a parar antes de que la exigencia ocupe todo.",
      "No necesitas resolverlo todo para demostrar fortaleza. Puedes decidir qué soltar y pedir apoyo cuando haga falta.",
      "Cuidar tu energía es una decisión legítima. Protege tu descanso y elige sin responder a todas las demandas.",
      "Tu valor no depende de cuánto soportas. Puedes poner límites, descansar y recuperar tu espacio personal."
    ],
    "reflective": [
      "¿Qué parte de tu saturación viene de las tareas y cuál de la presión por cumplirlas todas sin ayuda? No todo depende de ti.",
      "Quizá el cansancio esté mostrando un límite importante. ¿Qué ocurriría si lo escucharas sin juzgarte?",
      "Cuando todo parece urgente, puede ser útil preguntarte qué te está pidiendo realmente tu bienestar.",
      "A veces el descanso no es una interrupción, sino una necesidad. ¿Qué puedes dejar de exigirte hoy?"
    ]
  },
  "unmotivated": {
    "direct": [
      "No sentir motivación hoy no define tu futuro. Revisa qué necesitas y decide si descansar o retomar algo.",
      "La energía cambia de un día a otro. Puedes escuchar tu cansancio sin convertirlo en un juicio personal. No tienes que forzarte.",
      "No tienes que fabricar entusiasmo. Elige una actividad pequeña si te apetece o date permiso para parar. Puedes ir a tu ritmo.",
      "Tu día tiene valor aunque no produzcas nada. Observa cómo estás y decide qué forma de cuidado necesitas."
    ],
    "gentle": [
      "Hay días en los que cuesta encontrar impulso. Puedes acompañarte con cariño en vez de exigirte más.",
      "No pasa nada si hoy tu energía es distinta. Mereces descanso, compañía o un momento agradable sin culpa.",
      "La falta de ganas no borra lo que eres. Date tiempo para sentirte como estás sin pedirte otra versión de ti.",
      "Quizá hoy no necesites motivarte, sino descansar. Tu bienestar merece atención incluso cuando no avanzas."
    ],
    "powerful": [
      "Tu valor permanece aunque la motivación cambie. Puedes elegir cómo cuidarte sin rendir cuentas a nadie.",
      "No necesitas estar siempre inspirada para confiar en ti. Respetar tu energía también es una forma de fuerza.",
      "Poner límites a la autoexigencia es una decisión valiente. Tu bienestar merece un lugar por delante de las metas.",
      "Tu ritmo es tuyo. Puedes volver a empezar cuando quieras, sin dejar que un día difícil defina tu camino. Tu bienestar va primero."
    ],
    "reflective": [
      "Quizá no falte motivación, sino descanso o sentido. ¿Qué necesidad te gustaría escuchar antes de exigirte más?",
      "¿Qué ocurre cuando dejas de pedirte entusiasmo? Tal vez descubras una forma más amable de acompañarte.",
      "A veces confundimos cansancio con falta de voluntad. ¿Qué cambia si contemplas esa posibilidad sin juzgarte?",
      "Puede que hoy necesites reconectar contigo, no con una meta. ¿Qué te haría sentir un poco más acompañada?"
    ]
  }
};

let selectedState = "procrastination";
let selectedTone = "direct";
let generationCount = 1;
let lastSignature = "";

const stateButtons = [...document.querySelectorAll("[data-state]")];
const toneButtons = [...document.querySelectorAll("[data-tone]")];

const generatorLabel = document.getElementById("generatorLabel");
const generatorCounter = document.getElementById("generatorCounter");
const generatedPhrase = document.getElementById("generatedPhrase");
const generatedAction = document.getElementById("generatedAction");
const generatorFeedback = document.getElementById("generatorFeedback");

const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const shareButton = document.getElementById("shareButton");
const saveButton = document.getElementById("saveButton");
const downloadButton = document.getElementById("downloadButton");
const backToStatesButton = document.getElementById("backToStatesButton");
const generatorScrollContent = document.getElementById("generatorScrollContent");

let currentResult = {
  phrase: generatedPhrase?.textContent.trim() || "",
  action: generatedAction?.textContent.trim() || ""
};

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickWithIndex(array) {
  const index = Math.floor(Math.random() * array.length);

  return {
    value: array[index],
    index
  };
}

function formatCounter(number) {
  return String(number).padStart(2, "0");
}

function showFeedback(text) {
  if (!generatorFeedback) return;

  generatorFeedback.textContent = text;

  clearTimeout(generatorFeedback._timer);

  generatorFeedback._timer = setTimeout(() => {
    generatorFeedback.textContent = "";
  }, 2200);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {

    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy unavailable");
}

// Generación de reencuadres

function buildRestartMessage() {
  const messages = messagesByStateAndTone[selectedState]?.[selectedTone];
  const actions = restartEngine[selectedState]?.actions;

  if (!messages?.length || !actions?.length) {
    throw new Error("No hay reencuadres disponibles para esta selección.");
  }

  const candidates = messages
    .map((phrase, index) => ({ phrase, index }))
    .filter(({ index }) =>
      `${selectedState}-${selectedTone}-${index}` !== lastSignature
    );

  const selected = pickRandom(candidates.length ? candidates :
    messages.map((phrase, index) => ({ phrase, index })));

  lastSignature = `${selectedState}-${selectedTone}-${selected.index}`;

  return {
    phrase: selected.phrase,
    action: pickRandom(actions)
  };
}

function renderResult(result) {
  currentResult = result;

  const stateProfile = restartEngine[selectedState];
  const toneProfile = toneProfiles[selectedTone];

  generatorLabel.textContent =
    `${stateProfile.label} · ${toneProfile.label}`;

  generatorCounter.textContent =
    formatCounter(generationCount);

  generatedPhrase.classList.remove("is-changing");
  void generatedPhrase.offsetWidth;
  generatedPhrase.textContent = result.phrase;
  generatedPhrase.classList.add("is-changing");

  generatedAction.textContent = result.action;

  if (generatorScrollContent) {
    generatorScrollContent.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

function generateNewResult() {
  generationCount += 1;
  renderResult(buildRestartMessage());
}

function refreshForSelection() {
  generationCount = 1;
  lastSignature = "";
  renderResult(buildRestartMessage());
}

function scrollToElementWithHeader(
  element,
  focusTarget = null,
  safeGap = 22
) {
  if (!element) {
    return;
  }

  const headerHeight = siteHeader?.offsetHeight || 78;
  const elementTop =
    element.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: Math.max(0, elementTop - headerHeight - safeGap),
    behavior: "smooth"
  });

  if (focusTarget) {
    window.setTimeout(() => {
      focusTarget.focus({ preventScroll: true });
    }, 520);
  }
}

function scrollToGenerator() {
  const toneOptions = document.getElementById("toneOptions");

  scrollToElementWithHeader(
    toneOptions,
    null,
    30
  );
}

function scrollBackToStates() {
  const stateOptions = document.getElementById("stateOptions");
  const selectedCard = document.querySelector(
    "[data-state].is-selected"
  );

  scrollToElementWithHeader(
    stateOptions,
    selectedCard
  );
}

backToStatesButton?.addEventListener(
  "click",
  scrollBackToStates
);

stateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedState = button.dataset.state;

    stateButtons.forEach((candidate) => {
      const isSelected = candidate === button;

      candidate.classList.toggle("is-selected", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });

    refreshForSelection();

    requestAnimationFrame(() => {
      scrollToGenerator();
    });
  });
});

toneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTone = button.dataset.tone;

    toneButtons.forEach((candidate) => {
      const isSelected = candidate === button;

      candidate.classList.toggle("is-selected", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });

    refreshForSelection();
  });
});

generateButton?.addEventListener("click", generateNewResult);

function resultAsText() {
  return `${currentResult.phrase}\n\nMicroacción sugerida: ${currentResult.action}`;
}

copyButton?.addEventListener("click", async () => {
  try {
    await copyText(resultAsText());
    showFeedback("Reencuadre copiado.");
  } catch {
    showFeedback("No se pudo copiar.");
  }
});

shareButton?.addEventListener("click", async () => {
  const data = {
    title: "RE:START",
    text: `${resultAsText()}\n\nRE:START · Turn friction into motion`
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      showFeedback("Compartido.");
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await copyText(data.text);
    showFeedback("Tu navegador no permite compartir. Texto copiado.");
  } catch {
    showFeedback("No se pudo compartir.");
  }
});

// Reencuadres guardados

const STORAGE_KEY = "restart_saved_v1";

function getSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      item && typeof item === "object"
      && typeof item.id === "string"
      && typeof item.phrase === "string"
      && typeof item.action === "string"
      && typeof item.state === "string"
      && typeof item.tone === "string"
    );
  } catch {
    return [];
  }
}

function setSaved(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    showFeedback("No se puede guardar en este navegador.");
    return false;
  }
}

function saveCurrentResult() {
  const saved = getSaved();

  const alreadyExists = saved.some(
    (item) =>
      item.phrase === currentResult.phrase
      && item.action === currentResult.action
  );

  if (alreadyExists) {
    showFeedback("Esta frase ya está guardada.");
    return;
  }

  saved.unshift({
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    phrase: currentResult.phrase,
    action: currentResult.action,
    state: restartEngine[selectedState].label,
    tone: toneProfiles[selectedTone].label,
    createdAt: new Date().toISOString()
  });

  if (setSaved(saved)) showFeedback("Guardada.");
}

saveButton?.addEventListener("click", saveCurrentResult);

const savedGrid = document.getElementById("savedGrid");
const savedCount = document.getElementById("savedCount");
const emptySavedState = document.getElementById("emptySavedState");
const clearSavedButton = document.getElementById("clearSavedButton");

function renderSaved() {
  if (!savedGrid || !savedCount || !emptySavedState) {
    return;
  }

  const saved = getSaved();

  savedCount.textContent =
    `${saved.length} ${saved.length === 1 ? "frase guardada" : "frases guardadas"}`;

  savedGrid.innerHTML = "";

  const hasSaved = saved.length > 0;

  emptySavedState.hidden = hasSaved;
  savedGrid.hidden = !hasSaved;
  clearSavedButton.hidden = !hasSaved;

  saved.forEach((item) => {
    const card = document.createElement("article");
    card.className = "saved-card";

    const meta = document.createElement("div");
    meta.className = "saved-card-meta";

    const context = document.createElement("span");
    context.textContent = `${item.state} · ${item.tone}`;

    const date = document.createElement("span");
    date.textContent = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(Number.isFinite(Date.parse(item.createdAt)) ? new Date(item.createdAt) : new Date(0));

    meta.append(context, date);

    const quote = document.createElement("blockquote");
    quote.textContent = item.phrase;

    const action = document.createElement("div");
    action.className = "saved-card-action";
    action.textContent = `Microacción sugerida: ${item.action}`;

    const actions = document.createElement("div");
    actions.className = "saved-card-actions";

    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "Copiar";

    copy.addEventListener("click", async () => {
      try {
        await copyText(`${item.phrase}\n\nMicroacción sugerida: ${item.action}`);
        copy.textContent = "Copiado";
        setTimeout(() => { copy.textContent = "Copiar"; }, 1400);
      } catch {
        copy.textContent = "Error al copiar";
        setTimeout(() => { copy.textContent = "Copiar"; }, 1800);
      }
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Eliminar";

    remove.addEventListener("click", () => {
      const nextSaved = getSaved().filter(
        (savedItem) => savedItem.id !== item.id
      );

      if (setSaved(nextSaved)) renderSaved();
    });

    actions.append(copy, remove);
    card.append(meta, quote, action, actions);
    savedGrid.appendChild(card);
  });
}

clearSavedButton?.addEventListener("click", () => {
  if (!getSaved().length) {
    return;
  }

  const shouldClear = window.confirm(
    "¿Quieres eliminar todas las frases guardadas en este navegador?"
  );

  if (!shouldClear) {
    return;
  }

  if (setSaved([])) renderSaved();
});

// Exportación PNG

function wrapText(context, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (
      context.measureText(candidate).width <= maxWidth
      || !currentLine
    ) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function downloadCurrentAsImage() {
  try {
    if (document.fonts?.ready) await document.fonts.ready;

    const width = 1080;
    const height = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");

    context.fillStyle = "#10131A";
    context.fillRect(0, 0, width, height);
    const gradient = context.createRadialGradient(870, 180, 30, 870, 180, 680);
    gradient.addColorStop(0, "rgba(200,255,61,0.16)");
    gradient.addColorStop(1, "rgba(200,255,61,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(255,255,255,0.18)";
    context.lineWidth = 2;
    context.strokeRect(64, 64, width - 128, height - 128);

    context.textBaseline = "alphabetic";
    context.fillStyle = "#C8FF3D";
    context.font = '700 30px "Space Grotesk", Inter, sans-serif';
    context.fillText("RE:START", 100, 132);
    context.fillStyle = "#AEB6C5";
    context.font = '700 16px Inter, sans-serif';
    context.fillText(
      `${restartEngine[selectedState].label} · ${toneProfiles[selectedTone].label}`,
      100, 188
    );

    const quoteText = currentResult.phrase;
    const actionText = currentResult.action;
    const quoteFamily = '"Space Grotesk", Inter, sans-serif';
    const actionFamily = 'Inter, sans-serif';
    const topBoundary = 275;
    const bottomBoundary = 1114;
    const availableHeight = bottomBoundary - topBoundary;
    const quoteWidth = 880;
    const actionWidth = 758;
    const gap = 68;
    let layout = null;

    for (let quoteSize = 68; quoteSize >= 24; quoteSize -= 2) {
      context.font = `600 ${quoteSize}px ${quoteFamily}`;
      const quoteLines = wrapText(context, quoteText, quoteWidth);
      const quoteLineHeight = Math.round(quoteSize * 1.2);
      const quoteHeight = quoteLines.length * quoteLineHeight;

      for (let actionSize = 30; actionSize >= 20; actionSize -= 2) {
        context.font = `600 ${actionSize}px ${actionFamily}`;
        const actionLines = wrapText(context, actionText, actionWidth);
        const actionLineHeight = Math.round(actionSize * 1.43);
        const actionHeight = 104 + actionLines.length * actionLineHeight;
        const totalHeight = quoteHeight + gap + actionHeight;
        if (totalHeight <= availableHeight) {
          layout = {
            quoteSize, quoteLines, quoteLineHeight, quoteHeight,
            actionSize, actionLines, actionLineHeight, actionHeight,
            totalHeight
          };
          break;
        }
      }
      if (layout) break;
    }

    if (!layout) {
      context.font = `600 22px ${quoteFamily}`;
      const quoteLines = wrapText(context, quoteText, quoteWidth);
      context.font = `600 18px ${actionFamily}`;
      const actionLines = wrapText(context, actionText, actionWidth);
      const quoteLineHeight = 27;
      const actionLineHeight = 26;
      const quoteHeight = quoteLines.length * quoteLineHeight;
      const actionHeight = 104 + actionLines.length * actionLineHeight;
      layout = {
        quoteSize: 22, quoteLines, quoteLineHeight, quoteHeight,
        actionSize: 18, actionLines, actionLineHeight, actionHeight,
        totalHeight: quoteHeight + gap + actionHeight
      };
      if (layout.totalHeight > availableHeight) {
        throw new Error("El mensaje no cabe en la imagen sin recortes.");
      }
    }

    const contentStart = topBoundary + (availableHeight - layout.totalHeight) / 2;
    context.fillStyle = "#F7F8FB";
    context.font = `600 ${layout.quoteSize}px ${quoteFamily}`;
    layout.quoteLines.forEach((line, index) => {
      context.fillText(line, 100, contentStart + layout.quoteSize + index * layout.quoteLineHeight);
    });

    const actionY = contentStart + layout.quoteHeight + gap;
    context.fillStyle = "#8F78FF";
    context.fillRect(100, actionY, 6, layout.actionHeight - 8);
    context.fillStyle = "#C9BFFF";
    context.font = '700 16px Inter, sans-serif';
    context.fillText("MICROACCIÓN SUGERIDA", 136, actionY + 34);
    context.fillStyle = "#F1EEFF";
    context.font = `600 ${layout.actionSize}px ${actionFamily}`;
    layout.actionLines.forEach((line, index) => {
      context.fillText(line, 136, actionY + 75 + layout.actionSize + index * layout.actionLineHeight);
    });

    context.fillStyle = "#747F91";
    context.font = '500 18px Inter, sans-serif';
    context.fillText("Turn friction into motion.", 100, height - 105);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Image could not be generated");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `restart-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showFeedback("Imagen generada.");
  } catch (error) {
    console.warn("No se pudo exportar RE:START:", error);
    showFeedback("No se pudo generar la imagen.");
  }
}

downloadButton?.addEventListener(
  "click",
  downloadCurrentAsImage
);

function initializeApp() {
  const initialView = getViewFromHash();

  renderResult(buildRestartMessage());
  renderSaved();
  showView(initialView, false);
}

initializeApp();
