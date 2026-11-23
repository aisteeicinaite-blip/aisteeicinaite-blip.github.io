/* ===== KONTAKTŲ FORMA ===== */

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const clearBtn = document.getElementById('clear-btn');
  const result = document.getElementById('form-result');

  if (!form) return;

  /* ----- Formos laukai ----- */

  const fields = {
    vardas: document.getElementById('vardas'),
    pavarde: document.getElementById('pavarde'),
    elPastas: document.getElementById('elPastas'),
    telefonas: document.getElementById('telefonas'),
    adresas: document.getElementById('adresas'),
    klausimas1: document.getElementById('klausimas1'),
    klausimas2: document.getElementById('klausimas2'),
    klausimas3: document.getElementById('klausimas3')
  };

  /* ----- Validacijos taisyklės ----- */

  const letters = /^\p{L}+$/u;
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneFormat = /^\+370 6\d{2} \d{5}$/;

  // Grąžina klaidos tekstą arba tuščią eilutę, jei laukas teisingas
  function validateField(name) {
    const value = fields[name].value.trim();

    if (value === '') {
      return 'Šis laukas privalomas.';
    }

    switch (name) {
      case 'vardas':
      case 'pavarde':
        if (!letters.test(value)) {
          return 'Galima įvesti tik raides.';
        }
        break;

      case 'elPastas':
        if (!emailFormat.test(value)) {
          return 'Neteisingas el. pašto formatas (pvz., vardenis@mail.com).';
        }
        break;

      case 'telefonas':
        if (!phoneFormat.test(value)) {
          return 'Numeris turi būti formatu +370 6xx xxxxx.';
        }
        break;

      case 'klausimas1':
      case 'klausimas2':
      case 'klausimas3': {
        const number = Number(value);
        if (!Number.isInteger(number) || number < 1 || number > 10) {
          return 'Įvertinimas turi būti sveikasis skaičius nuo 1 iki 10.';
        }
        break;
      }
    }

    return '';
  }

  // Parodo arba paslepia klaidą po lauku
  function showError(name, message) {
    const input = fields[name];
    const feedback = input.nextElementSibling;

    input.classList.toggle('is-invalid', message !== '');
    feedback.textContent = message;
  }

  // „Siųsti“ aktyvus tik kai visi laukai užpildyti ir be klaidų
  function updateSubmitButton() {
    const allValid = Object.keys(fields).every(function (name) {
      return validateField(name) === '';
    });

    submitBtn.disabled = !allValid;
  }

  /* ----- Telefono numerio formatavimas ----- */

  function formatPhone(value) {
    // Atskiriamas jau pridėtas šalies kodas +370
    const rest = value.startsWith('+370') ? value.slice(4) : value;

    // Paliekami tik skaitmenys
    let digits = rest.replace(/\D/g, '');

    // Jei vartotojas pats įveda 370, jis nedubliuojamas
    if (/^370\d/.test(digits)) {
      digits = digits.slice(3);
    }

    // Senasis „8“ prefiksas pakeičiamas į +370
    if (digits.startsWith('8')) {
      digits = digits.slice(1);
    }

    // Lietuviškame numeryje po +370 yra 8 skaitmenys
    digits = digits.slice(0, 8);

    if (digits.length === 0) {
      return '';
    }
    if (digits.length <= 3) {
      return '+370 ' + digits;
    }
    return '+370 ' + digits.slice(0, 3) + ' ' + digits.slice(3);
  }

  /* ----- Validacija realiu laiku ----- */

  Object.keys(fields).forEach(function (name) {
    const input = fields[name];

    input.addEventListener('input', function () {
      if (name === 'telefonas') {
        input.value = formatPhone(input.value);
      }

      showError(name, validateField(name));
      updateSubmitButton();
    });

    input.addEventListener('blur', function () {
      showError(name, validateField(name));
    });
  });

  /* ----- Duomenų pateikimas ----- */

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (submitBtn.disabled) return;

    // Formos duomenys surenkami į objektą
    const formData = {
      vardas: fields.vardas.value.trim(),
      pavarde: fields.pavarde.value.trim(),
      elPastas: fields.elPastas.value.trim(),
      telefonas: fields.telefonas.value.trim(),
      adresas: fields.adresas.value.trim(),
      klausimas1: Number(fields.klausimas1.value),
      klausimas2: Number(fields.klausimas2.value),
      klausimas3: Number(fields.klausimas3.value)
    };

    console.log(formData);

    // Trijų įvertinimų vidurkis
    const average = (formData.klausimas1 + formData.klausimas2 + formData.klausimas3) / 3;

    const lines = [
      'Vardas: ' + formData.vardas,
      'Pavardė: ' + formData.pavarde,
      'El. paštas: ' + formData.elPastas,
      'Tel. numeris: ' + formData.telefonas,
      'Adresas: ' + formData.adresas,
      'Dizaino įvertinimas: ' + formData.klausimas1,
      'Turinio aiškumo įvertinimas: ' + formData.klausimas2,
      'Naudojimo patogumo įvertinimas: ' + formData.klausimas3
    ];

    // Rezultatai pavaizduojami formos apačioje
    result.innerHTML = '';

    lines.forEach(function (line) {
      const p = document.createElement('p');
      p.textContent = line;
      result.appendChild(p);
    });

    const averageLine = document.createElement('p');
    averageLine.className = 'form-average';
    averageLine.textContent = formData.vardas + ' ' + formData.pavarde + ': ' + average.toFixed(1);
    result.appendChild(averageLine);

    result.hidden = false;
  });

  /* ----- Formos išvalymas ----- */

  clearBtn.addEventListener('click', function () {
    form.reset();

    Object.keys(fields).forEach(function (name) {
      showError(name, '');
    });

    result.innerHTML = '';
    result.hidden = true;
    submitBtn.disabled = true;
  });

});