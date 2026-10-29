var menyKnapp = document.getElementById("menyKnapp");
var meny = document.getElementById("meny");

if (menyKnapp && meny) {
  menyKnapp.onclick = function () {
    meny.classList.toggle("apen");
  };
  meny.onclick = function (e) {
    if (e.target.tagName === "A") meny.classList.remove("apen");
  };
}

var filterKnapper = document.querySelectorAll(".filter button");
var hjelpere = document.querySelectorAll(".hjelper");

for (var i = 0; i < filterKnapper.length; i++) {
  filterKnapper[i].onclick = function () {
    var valgt = this.dataset.sprak;
    for (var j = 0; j < filterKnapper.length; j++) {
      filterKnapper[j].classList.remove("valgt");
    }
    this.classList.add("valgt");
    for (var k = 0; k < hjelpere.length; k++) {
      var sprak = hjelpere[k].dataset.sprak || "";
      hjelpere[k].hidden = !(valgt === "alle" || sprak.indexOf(valgt) !== -1);
    }
  };
}

var tipsListe = [
  "// En enkel funksjon som sier hei\nfunction sayHello(name) {\n  return 'Hei, ' + name + '!';\n}\nconsole.log(sayHello('Utvikler'));",
  "# Skriv ut tallene fra 1 til 3\nfor tall in range(1, 4):\n    print(tall)",
  "/* Gjor en knapp rund med CSS */\nbutton {\n  padding: 12px 24px;\n  border-radius: 999px;\n}",
];
var tipsNr = 0;
var nyttTips = document.getElementById("nyttTips");
var tipsKode = document.getElementById("tipsKode");

if (nyttTips && tipsKode) {
  nyttTips.onclick = function () {
    tipsNr = (tipsNr + 1) % tipsListe.length;
    tipsKode.textContent = tipsListe[tipsNr];
  };
}

var okter = {
  99: "Feilsoking",
  129: "Kodegjennomgang",
  149: "Hjelp med oppgave",
};

var skjema = document.getElementById("skjema");
var hjelperValg = document.getElementById("hjelper");
var oktValg = document.getElementById("okt");
var dato = document.getElementById("dato");

if (skjema && hjelperValg && oktValg && dato) {
  var idag = new Date();
  idag.setMinutes(idag.getMinutes() - idag.getTimezoneOffset());
  dato.min = idag.toISOString().slice(0, 10);
  dato.value = dato.min;

  function oppdater() {
    var sumHjelper = document.getElementById("sumHjelper");
    var sumOkt = document.getElementById("sumOkt");
    var sumDato = document.getElementById("sumDato");
    var sumPris = document.getElementById("sumPris");
    if (sumHjelper) sumHjelper.textContent = "Hjelper: " + hjelperValg.value;
    if (sumOkt) sumOkt.textContent = okter[oktValg.value] || "Velg en okt";
    if (sumDato) sumDato.textContent = "Dato: " + dato.value;
    if (sumPris) sumPris.textContent = oktValg.value + " kr";
  }

  hjelperValg.onchange = oppdater;
  oktValg.onchange = oppdater;
  dato.onchange = oppdater;
  oppdater();

  var bookKnapper = document.querySelectorAll("[data-navn]");
  for (var b = 0; b < bookKnapper.length; b++) {
    bookKnapper[b].onclick = function () {
      hjelperValg.value = this.dataset.navn;
      oppdater();
      var book = document.getElementById("book");
      if (book) book.scrollIntoView({ behavior: "smooth" });
    };
  }

  skjema.onsubmit = function (e) {
    e.preventDefault();
    var feil = document.getElementById("feil");
    var navnEl = document.getElementById("navn");
    var epostEl = document.getElementById("epost");
    var navn = navnEl ? navnEl.value.trim() : "";
    var epost = epostEl ? epostEl.value.trim() : "";

    if (navn.length < 2) {
      feil.textContent = "Du ma skrive inn navnet ditt.";
      return;
    }
    if (epost.indexOf("@") === -1 || epost.indexOf(".") === -1) {
      feil.textContent = "E-posten ser ikke riktig ut.";
      return;
    }
    if (dato.value < dato.min) {
      feil.textContent = "Velg en dato fra i dag og fremover.";
      return;
    }

    feil.textContent = "";
    var takk = document.getElementById("takk");
    takk.textContent =
      "Takk, " +
      navn +
      "! Du har booket " +
      (okter[oktValg.value] || "en okt") +
      " med " +
      hjelperValg.value.toLowerCase() +
      " " +
      dato.value +
      ". Dette er bare en prototype.";
    takk.hidden = false;
    skjema.reset();
    dato.value = dato.min;
    oppdater();
  };
}

var sporsmal = document.querySelectorAll(".faq button");
for (var s = 0; s < sporsmal.length; s++) {
  sporsmal[s].onclick = function () {
    var svar = this.nextElementSibling;
    if (svar) svar.hidden = !svar.hidden;
  };
}

var chatKnapp = document.getElementById("chatKnapp");
var chatVindu = document.getElementById("chatVindu");
var chatMeldinger = document.getElementById("chatMeldinger");
var chatInput = document.getElementById("chatInput");
var chatSkjema = document.getElementById("chatSkjema");
var chatLukk = document.getElementById("chatLukk");

function leggTil(tekst, hvem) {
  if (!chatMeldinger) return;
  var p = document.createElement("p");
  p.className = "melding " + hvem;
  p.textContent = tekst;
  chatMeldinger.appendChild(p);
  chatMeldinger.scrollTop = chatMeldinger.scrollHeight;
}

function visSkriver() {
  var skriver = document.createElement("p");
  skriver.className = "melding bot skriver";
  skriver.setAttribute("aria-label", "Kodebot skriver");
  for (var i = 0; i < 3; i++) {
    skriver.appendChild(document.createElement("span"));
  }
  chatMeldinger.appendChild(skriver);
  chatMeldinger.scrollTop = chatMeldinger.scrollHeight;
  return skriver;
}

function fjernSkriver(skriver) {
  if (skriver && skriver.parentNode) {
    skriver.parentNode.removeChild(skriver);
  }
}

function byttChat() {
  if (!chatVindu) return;
  chatVindu.hidden = !chatVindu.hidden;
  if (!chatVindu.hidden) {
    if (chatMeldinger && chatMeldinger.children.length === 0) {
      leggTil("Hei! Jeg er Kodebot. Hva lurer du pa?", "bot");
    }
    if (chatInput) chatInput.focus();
  }
}

if (chatKnapp) chatKnapp.onclick = byttChat;
var apneChat = document.getElementById("apneChat");
if (apneChat) {
  apneChat.onclick = function () {
    if (chatVindu && chatVindu.hidden) byttChat();
    if (chatInput) chatInput.focus();
  };
}
if (chatLukk) {
  chatLukk.onclick = function () {
    if (chatVindu) chatVindu.hidden = true;
  };
}

async function spor(tekst) {
  leggTil(tekst, "meg");
  if (!chatMeldinger) return;
  var skriver = visSkriver();

  try {
    var svar = await sporBot(tekst);
    fjernSkriver(skriver);
    leggTil(svar, "bot");
  } catch (error) {
    fjernSkriver(skriver);
    leggTil(
      "Jeg far ikke kontakt med chatboten akkurat na. Sjekk at API-nokkelen er riktig.",
      "bot",
    );
    console.error("Kodebot-feil:", error);
  }
}

if (chatSkjema) {
  chatSkjema.onsubmit = function (e) {
    e.preventDefault();
    var tekst = chatInput.value.trim();
    if (!tekst) return;
    chatInput.value = "";
    spor(tekst);
  };
}

var forslagListe = [
  "Hvordan lager jeg en knapp i HTML?",
  "Hva er forskjellen pa var og let?",
  "Hvordan far jeg en nettside pa internett?",
  "Hva er en API?",
  "Hvordan loser jeg en feilmelding i Python?",
  "Hva er Git og GitHub?",
  "Hvordan far jeg en div midt pa siden?",
  "Hva er forskjellen pa HTML og CSS?",
  "Hvordan skriver jeg en for-lokke i JavaScript?",
  "Hva er en funksjon?",
  "Hva betyr det at noe er asynkront?",
  "Hvordan lager jeg en skjema i HTML?",
];

var forslagBeholder = document.querySelector(".chatForslag");
if (forslagBeholder) {
  if (forslagBeholder.children.length === 0) {
    for (var f = 0; f < forslagListe.length; f++) {
      var knapp = document.createElement("button");
      knapp.type = "button";
      knapp.textContent = forslagListe[f];
      forslagBeholder.appendChild(knapp);
    }
  }
}

var forslag = document.querySelectorAll(".chatForslag button");
for (var f2 = 0; f2 < forslag.length; f2++) {
  forslag[f2].onclick = function () {
    spor(this.textContent.trim());
  };
}

var sokInput = document.getElementById("sokInput");
var sokSkjema = document.getElementById("sokSkjema");

function aapneChatMedSporsmal(sporsmal) {
  if (chatVindu && chatVindu.hidden) byttChat();
  spor(sporsmal);
}

if (sokSkjema && sokInput) {
  sokSkjema.onsubmit = function (e) {
    e.preventDefault();
    var tekst = sokInput.value.trim();
    if (!tekst) {
      sokInput.focus();
      return;
    }
    sokInput.value = "";
    aapneChatMedSporsmal(tekst);
  };
}
