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


/* ===== KOMPETENCIJŲ PAŽANGOS MODULIS ===== */

document.addEventListener('DOMContentLoaded', function () {

  if (!document.getElementById('cards-planuojama')) return;

  /* ----- Pradiniai duomenys ----- */

  const statuses = ['Planuojama', 'Mokomasi', 'Atlikta'];

  const skills = [
    { pavadinimas: 'Python programavimas', busena: 'Planuojama', xp: 50 },
    { pavadinimas: 'PLC valdikliai', busena: 'Planuojama', xp: 60 },
    { pavadinimas: 'Elektros tinklų projektavimas', busena: 'Planuojama', xp: 40 },
    { pavadinimas: 'MATLAB programavimas', busena: 'Mokomasi', xp: 60 },
    { pavadinimas: 'Elektros energetikos sistemos', busena: 'Mokomasi', xp: 50 },
    { pavadinimas: 'Microsoft Excel', busena: 'Atlikta', xp: 50 },
    { pavadinimas: 'HTML ir CSS', busena: 'Atlikta', xp: 40 },
    { pavadinimas: 'Elektros grandinių analizė', busena: 'Atlikta', xp: 70 }
  ];

  // Lygių ir rangų lentelė (max – kito lygio riba)
  const levels = [
    { lygis: 1, min: 0, max: 50, rangas: 'Pradedantysis' },
    { lygis: 2, min: 50, max: 150, rangas: 'Praktikantas' },
    { lygis: 3, min: 150, max: 300, rangas: 'Specialistas' },
    { lygis: 4, min: 300, max: null, rangas: 'Profesionalas' }
  ];

  const storageKey = 'igudziuBusenos';

  /* ----- Vietinė saugykla (Local Storage) ----- */

  // Išsaugo kiekvieno įgūdžio būseną
  function saveStatuses() {
    const saved = {};

    skills.forEach(function (skill) {
      saved[skill.pavadinimas] = skill.busena;
    });

    localStorage.setItem(storageKey, JSON.stringify(saved));
  }

  // Atkuria išsaugotas būsenas (jei jų nėra – lieka pradinės)
  function loadStatuses() {
    const data = localStorage.getItem(storageKey);

    if (!data) return;

    let saved;

    try {
      saved = JSON.parse(data);
    } catch (error) {
      return;
    }

    skills.forEach(function (skill) {
      if (statuses.includes(saved[skill.pavadinimas])) {
        skill.busena = saved[skill.pavadinimas];
      }
    });
  }

  /* ----- Pagalbinės funkcijos ----- */

  // Teisinga žodžio „įgūdis“ forma pagal skaičių
  function skillWord(count) {
    const lastTwo = count % 100;
    const last = count % 10;

    if (last === 1 && lastTwo !== 11) return count + ' įgūdis';
    if (last >= 2 && last <= 9 && (lastTwo < 12 || lastTwo > 19)) return count + ' įgūdžiai';
    return count + ' įgūdžių';
  }

  // Grąžina lygį pagal XP kiekį
  function getLevel(xp) {
    return levels.find(function (level) {
      return level.max === null || xp < level.max;
    });
  }

  // Sudeda tik „Atlikta“ būsenos įgūdžių XP
  function calculateXp() {
    return skills
      .filter(function (skill) { return skill.busena === 'Atlikta'; })
      .reduce(function (sum, skill) { return sum + skill.xp; }, 0);
  }

  /* ----- Įgūdžių kortelių atvaizdavimas ----- */

  function createCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill-card';

    const title = document.createElement('h5');
    title.textContent = skill.pavadinimas;

    const label = document.createElement('label');
    label.className = 'skill-status-label';
    label.textContent = 'Būsena:';

    const select = document.createElement('select');
    select.className = 'skill-status';

    statuses.forEach(function (status) {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      option.selected = status === skill.busena;
      select.appendChild(option);
    });

    // Pakeitus būseną, kortelė perkeliama ir viskas perskaičiuojama
    select.addEventListener('change', function () {
      skill.busena = select.value;
      saveStatuses();
      updateModule();
    });

    label.appendChild(select);

    const xp = document.createElement('strong');
    xp.textContent = skill.xp + ' XP';

    card.appendChild(title);
    card.appendChild(label);
    card.appendChild(xp);

    return card;
  }

  function renderCards() {
    statuses.forEach(function (status) {
      const column = document.getElementById('cards-' + status.toLowerCase());
      const count = document.getElementById('count-' + status.toLowerCase());

      const columnSkills = skills.filter(function (skill) {
        return skill.busena === status;
      });

      column.innerHTML = '';

      columnSkills.forEach(function (skill) {
        column.appendChild(createCard(skill));
      });

      count.textContent = skillWord(columnSkills.length);
    });
  }

  /* ----- XP, lygio, rango ir progreso juostos atnaujinimas ----- */

  function renderProgress() {
    const xp = calculateXp();
    const level = getLevel(xp);
    const progressBar = document.getElementById('xp-progress-bar');

    document.getElementById('xp-total').textContent = xp + ' XP';
    document.getElementById('level-text').textContent = level.lygis + ' lygis – ' + level.rangas;

    let percent;

    if (level.max === null) {
      // Pasiektas 4 lygis – juosta pilna
      percent = 100;
      document.getElementById('progress-label').textContent = 'Pasiektas aukščiausias lygis';
      document.getElementById('progress-text').textContent = xp + ' XP';
      document.getElementById('next-level-text').textContent = 'Pasiektas aukščiausias lygis – ' + level.rangas + '.';
    } else {
      const nextLevel = levels[level.lygis];

      // Progresas nuo einamojo lygio pradžios iki kito lygio ribos
      percent = (xp - level.min) / (level.max - level.min) * 100;
      document.getElementById('progress-label').textContent = 'Pažanga iki ' + nextLevel.lygis + ' lygio (' + level.min + '–' + level.max + ' XP)';
      document.getElementById('progress-text').textContent = xp + ' / ' + level.max + ' XP';
      document.getElementById('next-level-text').textContent =
        'Iki kito lygio (' + nextLevel.lygis + ' – ' + nextLevel.rangas + ') liko ' + (level.max - xp) + ' XP.';
    }

    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent.toFixed(2));
  }

  /* ----- Statistikos atnaujinimas ----- */

  function renderStatistics() {
    const total = skills.length;
    const completed = skills.filter(function (skill) {
      return skill.busena === 'Atlikta';
    }).length;
    const percent = total === 0 ? 0 : completed / total * 100;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-percent').textContent =
      percent.toLocaleString('lt-LT', { maximumFractionDigits: 1 }) + '%';
  }

  /* ----- Viso modulio atnaujinimas ----- */

  function updateModule() {
    renderCards();
    renderProgress();
    renderStatistics();
  }

  loadStatuses();
  updateModule();

});