let doctors = [
    {
      name: 'Dr. John Doe',
      specialties: ['Cardiology', 'Hypertension'],
      experience: 10,
      fees: 500,
      consultation_mode: 'Online'
    },
    {
      name: 'Dr. Jane Smith',
      specialties: ['Neurology', 'Headache'],
      experience: 8,
      fees: 600,
      consultation_mode: 'In-person'
    },
    {
      name: 'Dr. Emily White',
      specialties: ['Orthopedics', 'Spine'],
      experience: 15,
      fees: 700,
      consultation_mode: 'Online'
    },
    {
      name: 'Dr. Michael Brown',
      specialties: ['Pediatrics', 'Child Care'],
      experience: 12,
      fees: 450,
      consultation_mode: 'In-person'
    },
    {
      name: 'Dr. Sarah Lee',
      specialties: ['Dermatology', 'Skin Care'],
      experience: 7,
      fees: 550,
      consultation_mode: 'Online'
    }
  ];
  
  let filteredDoctors = [];
  
  function setupSpecialtyFilters() {
    const specialties = new Set();
    doctors.forEach(doc => doc.specialties.forEach(spec => specialties.add(spec)));
  
    const container = document.getElementById('speciality-filters');
    specialties.forEach(spec => {
      const id = spec.replace(/\s|\//g, '-');
      container.innerHTML += `
        <label>
          <input type="checkbox" value="${spec}" data-testid="filter-specialty-${id}" />
          ${spec}
        </label><br/>
      `;
    });
  }
  
  function renderDoctors(list) {
    const container = document.getElementById('doctorList');
    container.innerHTML = '';
    list.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doctor-card';
      card.setAttribute('data-testid', 'doctor-card');
      card.innerHTML = `
        <h3 data-testid="doctor-name">${doc.name}</h3>
        <p data-testid="doctor-specialty">${doc.specialties.join(', ')}</p>
        <p data-testid="doctor-experience">${doc.experience} years experience</p>
        <p data-testid="doctor-fee">₹${doc.fees}</p>
      `;
      container.appendChild(card);
    });
  }
  
  function setupSearch() {
    const input = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
  
    input.addEventListener('input', () => {
      const value = input.value.trim().toLowerCase();
      suggestions.innerHTML = '';
      if (value === '') return;
  
      const matches = doctors.filter(doc => doc.name.toLowerCase().includes(value)).slice(0, 3);
      matches.forEach(match => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.setAttribute('data-testid', 'suggestion-item');
        div.innerText = match.name;
        div.addEventListener('click', () => {
          input.value = match.name;
          suggestions.innerHTML = '';
          applyFilters();
        });
        suggestions.appendChild(div);
      });
    });
  
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        suggestions.innerHTML = '';
        applyFilters();
      }
    });
  }
  
  function getSelectedFilters() {
    const consultation = document.querySelector('input[name="consultation"]:checked')?.value;
    const specialties = Array.from(document.querySelectorAll('#speciality-filters input:checked')).map(cb => cb.value);
    const sort = document.querySelector('input[name="sort"]:checked')?.value;
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
  
    return { consultation, specialties, sort, searchText };
  }
  
  function applyFilters() {
    let { consultation, specialties, sort, searchText } = getSelectedFilters();
    filteredDoctors = doctors.slice();
  
    if (searchText) {
      filteredDoctors = filteredDoctors.filter(doc => doc.name.toLowerCase().includes(searchText));
    }
    if (consultation) {
      filteredDoctors = filteredDoctors.filter(doc => doc.consultation_mode === consultation);
    }
    if (specialties.length) {
      filteredDoctors = filteredDoctors.filter(doc => specialties.some(spec => doc.specialties.includes(spec)));
    }
    if (sort === 'fees') {
      filteredDoctors.sort((a, b) => a.fees - b.fees);
    } else if (sort === 'experience') {
      filteredDoctors.sort((a, b) => b.experience - a.experience);
    }
  
    updateURL();
    renderDoctors(filteredDoctors);
  }
  
  function updateURL() {
    const { consultation, specialties, sort, searchText } = getSelectedFilters();
    const params = new URLSearchParams();
  
    if (searchText) params.set('search', searchText);
    if (consultation) params.set('consultation', consultation);
    if (specialties.length) params.set('specialties', specialties.join(','));
    if (sort) params.set('sort', sort);
  
    history.pushState(null, '', '?' + params.toString());
  }
  
  function applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
  
    if (params.has('search')) {
      document.getElementById('searchInput').value = params.get('search');
    }
    if (params.has('consultation')) {
      document.querySelector(`input[name="consultation"][value="${params.get('consultation')}"]`)?.click();
    }
    if (params.has('specialties')) {
      params.get('specialties').split(',').forEach(spec => {
        const id = spec.replace(/\s|\//g, '-');
        document.querySelector(`input[data-testid="filter-specialty-${id}"]`)?.click();
      });
    }
    if (params.has('sort')) {
      document.querySelector(`input[name="sort"][value="${params.get('sort')}"]`)?.click();
    }
  
    applyFilters();
  }
  
  window.addEventListener('popstate', applyFiltersFromURL);
  
  document.addEventListener('DOMContentLoaded', () => {
    setupSpecialtyFilters();
    setupSearch();
  
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', applyFilters);
    });
  });
  