async function submitForm() {
  try {
    let stringa = document.querySelector("input").value;
    const response = await fetch("/string", {
      //http://localhost:5000
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ string: stringa }),
    }).then(async (response) => {
      const jsonData = await response.json();
      const ipa = jsonData.appIpa;
      const pin = jsonData.appPinyin;
      const original = jsonData.original;
      const pinStyled = jsonData.appPinyinStyled;
      const ipaStyled = jsonData.appIpaStyled;

      document.querySelector("#original").innerText = original;
      document.querySelector("#ipa").innerText = ipa;
      document.querySelector("#pinyin").innerText = pin;
    });
  } catch (err) {
    console.error(err.message);
  }
}
