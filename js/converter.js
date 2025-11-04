document.addEventListener("DOMContentLoaded", () => {
  // Tabs switch
  const tabs = document.querySelectorAll(".tab");
  const boxes = document.querySelectorAll(".converter-box");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      boxes.forEach(b => b.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ===== UNIT CONVERTER =====
  const unitTypes = {
    length: { m: 1, km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, yd: 1.09361, ft: 3.28084 },
    weight: { kg: 1, g: 1000, mg: 1e6, lb: 2.20462, oz: 35.274 },
    temperature: {}
  };

  const unitTypeSelect = document.getElementById("unit-type");
  const fromUnit = document.getElementById("from-unit");
  const toUnit = document.getElementById("to-unit");
  const unitAmount = document.getElementById("unit-amount");
  const unitResult = document.getElementById("unit-result");

  function populateUnits(type) {
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";
    if (type === "temperature") {
      ["Celsius", "Fahrenheit", "Kelvin"].forEach(u => {
        const opt1 = new Option(u, u.toLowerCase());
        const opt2 = new Option(u, u.toLowerCase());
        fromUnit.add(opt1);
        toUnit.add(opt2);
      });
    } else {
      Object.keys(unitTypes[type]).forEach(u => {
        const opt1 = new Option(u.toUpperCase(), u);
        const opt2 = new Option(u.toUpperCase(), u);
        fromUnit.add(opt1);
        toUnit.add(opt2);
      });
    }
  }

  populateUnits("length");

  unitTypeSelect.addEventListener("change", () => populateUnits(unitTypeSelect.value));

  document.getElementById("convert-unit").addEventListener("click", () => {
    const type = unitTypeSelect.value;
    let from = fromUnit.value;
    let to = toUnit.value;
    let value = parseFloat(unitAmount.value);
    if (isNaN(value)) return (unitResult.textContent = "Enter valid number.");

    if (type === "temperature") {
      let result;
      if (from === to) result = value;
      else if (from === "celsius" && to === "fahrenheit") result = value * 9/5 + 32;
      else if (from === "fahrenheit" && to === "celsius") result = (value - 32) * 5/9;
      else if (from === "celsius" && to === "kelvin") result = value + 273.15;
      else if (from === "kelvin" && to === "celsius") result = value - 273.15;
      else if (from === "fahrenheit" && to === "kelvin") result = (value - 32) * 5/9 + 273.15;
      else if (from === "kelvin" && to === "fahrenheit") result = (value - 273.15) * 9/5 + 32;
      unitResult.textContent = `${value} ${from} = ${result.toFixed(2)} ${to}`;
    } else {
      const base = unitTypes[type];
      const converted = (value / base[from]) * base[to];
      unitResult.textContent = `${value} ${from} = ${converted.toFixed(4)} ${to}`;
    }
  });

  // ===== CURRENCY CONVERTER =====
  const currencyRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    INR: 83.1,
    BDT: 118.3,
    CAD: 1.37,
    AUD: 1.52,
    JPY: 150.4,
    CNY: 7.1,
    AED: 3.67
  };

  const fromCurrency = document.getElementById("from-currency");
  const toCurrency = document.getElementById("to-currency");
  const currencyAmount = document.getElementById("currency-amount");
  const currencyResult = document.getElementById("currency-result");

  Object.keys(currencyRates).forEach(code => {
    const opt1 = new Option(code, code);
    const opt2 = new Option(code, code);
    fromCurrency.add(opt1);
    toCurrency.add(opt2);
  });

  fromCurrency.value = "USD";
  toCurrency.value = "BDT";

  document.getElementById("swap-btn").addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
  });

  document.getElementById("convert-currency").addEventListener("click", () => {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(currencyAmount.value);
    if (isNaN(amount)) return (currencyResult.textContent = "Enter valid number.");

    const usdValue = amount / currencyRates[from];
    const converted = usdValue * currencyRates[to];
    currencyResult.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
  });
});
