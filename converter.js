const pool = require("./db");

async function processStr(str) {
  let output = [];
  for (let i = 0; i < str.length; i++) {
    const pinRes = await pool.query("SELECT pin FROM utf WHERE char = $1", [
      str[i],
    ]);
    if (pinRes.rows[0]) {
      let currentPin = pinRes.rows[0].pin;

      let converted = stripAccent(currentPin);
      converted.pinyin = currentPin;
      const ipaRes = await pool.query("SELECT ipa FROM ipa WHERE syl = $1", [
        converted.syl,
      ]);
      converted.ipa = ipaRes.rows[0].ipa;
      converted.ipaStyled = styleIpa(converted);
      converted.pinStyled = stylePinyin(converted);
      output.push(converted);
    } else {
      let sym = checkUnrecognizedSymbol(str[i]);
      let converted = {
        syl: sym,
        tone: "",
        pinyin: sym,
        ipa: sym,
        ipaStyled: sym,
        pinStyled: sym,
      };
      output.push(converted);
    }
  }

  //put the sentence together
  let sentence = {
    appPinyin: "",
    appIpa: "",
    appPinyinStyled: "",
    appIpaStyled: "",
  };
  output.forEach((el) => {
    sentence.appPinyin = `${sentence.appPinyin}${el.pinyin} `;
    sentence.appIpa = `${sentence.appIpa}${el.ipa}${el.tone} `;
    sentence.appPinyinStyled = `${sentence.appPinyinStyled}${el.pinStyled} `;
    sentence.appIpaStyled = `${sentence.appIpaStyled}${el.ipaStyled} `;
  });

  sentence.original = str;

  return sentence;
}

/* Functions */

function checkUnrecognizedSymbol(symbol) {
  if (symbol === "？") {
    return "?";
  }
  if (symbol === "！") {
    return "!";
  }
  if (symbol === "，") {
    return ",";
  }
  if (symbol === "：") {
    return ":";
  }
  if (symbol === " ") {
    return "";
  }
  if (!isNaN(parseInt(symbol, 10))) {
    return `${symbol}`;
  } else {
    return ".";
  }
}

function stripAccent(syl) {
  let tone = determineTone(syl);
  let sylArray = syl.split("");
  for (let i = 0; i < sylArray.length; i++) {
    if (
      sylArray[i] === "ō" ||
      sylArray[i] === "ó" ||
      sylArray[i] === "ǒ" ||
      sylArray[i] === "ò"
    ) {
      sylArray[i] = "o";
    }
    if (
      sylArray[i] === "ā" ||
      sylArray[i] === "á" ||
      sylArray[i] === "ǎ" ||
      sylArray[i] === "à"
    ) {
      sylArray[i] = "a";
    }
    if (
      sylArray[i] === "ē" ||
      sylArray[i] === "é" ||
      sylArray[i] === "ě" ||
      sylArray[i] === "è"
    ) {
      sylArray[i] = "e";
    }
    if (
      sylArray[i] === "ī" ||
      sylArray[i] === "í" ||
      sylArray[i] === "ǐ" ||
      sylArray[i] === "ì"
    ) {
      sylArray[i] = "i";
    }
    if (
      sylArray[i] === "ū" ||
      sylArray[i] === "ú" ||
      sylArray[i] === "ǔ" ||
      sylArray[i] === "ù"
    ) {
      sylArray[i] = "u";
    }
    if (
      sylArray[i] === "ǖ" ||
      sylArray[i] === "ǘ" ||
      sylArray[i] === "ǚ" ||
      sylArray[i] === "ǜ"
    ) {
      sylArray[i] = "ü";
    }
  }
  let converted = "";
  sylArray.forEach((el) => {
    converted += el;
  });
  let sylAndTone = {
    syl: converted,
    tone: tone,
  };
  return sylAndTone;
}

function determineTone(syl) {
  let tone = 0;
  if (
    syl.includes("ō") ||
    syl.includes("ā") ||
    syl.includes("ē") ||
    syl.includes("ī") ||
    syl.includes("ū") ||
    syl.includes("ǖ")
  ) {
    tone = 1;
  }
  if (
    syl.includes("á") ||
    syl.includes("é") ||
    syl.includes("í") ||
    syl.includes("ó") ||
    syl.includes("ú") ||
    syl.includes("ǘ")
  ) {
    tone = 2;
  }
  if (
    syl.includes("ǎ") ||
    syl.includes("ě") ||
    syl.includes("ǐ") ||
    syl.includes("ǒ") ||
    syl.includes("ǔ") ||
    syl.includes("ǚ")
  ) {
    tone = 3;
  }
  if (
    syl.includes("à") ||
    syl.includes("è") ||
    syl.includes("ì") ||
    syl.includes("ò") ||
    syl.includes("ù") ||
    syl.includes("ǜ")
  ) {
    tone = 4;
  }

  return tone;
}

function stylePinyin(sylArr) {
  let tone = sylArr.tone;
  if (tone === 1) {
    return `<span class="tone1">${sylArr.pinyin}</span>`;
  }
  if (tone === 2) {
    return `<span class="tone2">${sylArr.pinyin}</span>`;
  }
  if (tone === 3) {
    return `<span class="tone3">${sylArr.pinyin}</span>`;
  }
  if (tone === 4) {
    return `<span class="tone4">${sylArr.pinyin}</span>`;
  }
  if (tone === 0) {
    return `<span class="tone0">${sylArr.pinyin}</span>`;
  }
}

//Add <span> to each ipa syllable so it can be styled
function styleIpa(sylArr) {
  let tone = sylArr.tone;
  if (tone === 1) {
    return `<span class="tone1">${sylArr.ipa}</span>`;
  }
  if (tone === 2) {
    return `<span class="tone2">${sylArr.ipa}</span>`;
  }
  if (tone === 3) {
    return `<span class="tone3">${sylArr.ipa}</span>`;
  }
  if (tone === 4) {
    return `<span class="tone4">${sylArr.ipa}</span>`;
  }
  if (tone === 0) {
    return `<span class="tone0">${sylArr.ipa}</span>`;
  }
}

module.exports = { processStr };
