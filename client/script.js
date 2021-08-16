async function submitForm() {
  try {
    let stringa = document.querySelector("input").value;
    await fetch("/string", {
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

async function submitCSV(hanzi) {
  let jsonData;
  try {
    const response = await fetch("/arr", {
      //http://localhost:5000
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hanzi: hanzi }),
    }).then(async (response) => {
      jsonData = await response.json();
    });
  } catch (err) {
    console.error(err.message);
  }
  return jsonData;
}

const csvForm = document.getElementById("csvForm");
const csvFile = document.getElementById("csvFile");
const headerRow = document.getElementById("headerRow");
const columnNo = document.getElementById("columnNo");
const inclIpa = document.getElementById("inclIpa");
const inclIpaStyled = document.getElementById("inclIpaStyl");
const inclPinyin = document.getElementById("inclPinyin");
let inputName;

csvForm.addEventListener("submit", function (e) {
  e.preventDefault(); // prevents browser from re-loading on submit
  document.querySelector("#status").innerText = "Processing...";
  document.querySelector("#download-link").innerText = "";
  try {
    const input = csvFile.files[0];
    inputName = input.name;

    const reader = new FileReader();
    reader.readAsText(input);
    reader.onload = async function (e) {
      const text = e.target.result;
      const data = csvToArray(text);
      const hanzi = filterOutHanzi(data);
      const response = await submitCSV(hanzi);
      const processed = await putItTogether(response, data);
      generateDownloadLink(processed);
    };
  } catch (error) {
    document.querySelector("#status").innerText = "Error. Try again.";
  }
});

function csvToArray(str, delimiter = ",") {
  let headers;
  let rows;
  let data;
  if (headerRow.checked) {
    // slice from start of text to the first \r\n index
    // use split to create an array from string by delimiter
    headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);

    // slice from \n index + 2 to the end of the text
    // use split to create an array of each csv value row
    rows = str.slice(str.indexOf("\r\n") + 2).split("\r\n");
    data = {
      header: headers,
    };
  } else {
    rows = str.split("\r\n");
    data = {
      header: "nada",
    };
  }
  const arr = rows.map((row) => (values = row.split(delimiter)));
  data.content = arr;
  return data;
}

function filterOutHanzi(data) {
  let hanzi = [];
  data.content.forEach((el) => {
    hanzi.push(el[columnNo.value - 1]);
  });
  return hanzi;
}

function putItTogether(response, data) {
  for (let i = 0; i < data.content.length; i++) {
    if (inclIpa.checked) {
      data.content[i].push(response[i].appIpa); //pushing IPA to original data
    }
    if (inclIpaStyled.checked) {
      data.content[i].push(response[i].appIpaStyled);
    }
    if (inclPinyin.checked) {
      data.content[i].push(response[i].appPinyin);
    }
  }
  if (data.header !== "nada") {
    if (inclIpa.checked) {
      data.header.push("IPA-App");
    }
    if (inclIpaStyled.checked) {
      data.header.push("IPA-Styled-App");
    }
    if (inclPinyin.checked) {
      data.header.push("Pinyin-App");
    }
  }
  return data;
}

function generateDownloadLink(processed) {
  let csvContent = "data:text/csv;charset=utf-8,";

  if (processed.header !== "nada") {
    let row = processed.header.join(",");
    csvContent += row + "\r\n";
  }

  processed.content.forEach((el) => {
    let row = el.join(",");
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  let link = document.querySelector("#download-link");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `${inputName.substring(0, inputName.indexOf(".csv"))}-processed.csv`
  );
  document.querySelector("#status").innerText = "File Ready:";
  link.innerText = "Download";
}
