import './css/styles.css';
import fetchCountries from './fetch-countries';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countriesInfo: document.querySelector('.country-info'),
};

let searchCountryName = '';

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  searchCountryName = refs.input.value.trim();
  if (searchCountryName === '') {
    clearData();
    return;
  } else
    fetchCountries(searchCountryName)
      .then(countryNames => {
        if (countryNames.length < 2) {
          createCountrieCard(countryNames);
          Notiflix.Notify.success('Here your result');
        } else if (countryNames.length < 10 && countryNames.length > 1) {
          createCountrieList(countryNames);
          Notiflix.Notify.success('Here your results');
        } else {
          clearAll();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearData();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
}

function createCountrieList(country) {
  clearData();
  const list = country
    .map(
      c =>
        `<li class="country-list--item">
            <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${c.name.official}</span>
        </li>`
    )
    .join('');
  refs.countriesList.insertAdjacentHTML('beforeend', list);
}

function createCountrieCard(country) {
  clearData();
  const c = country[0];

  const card = `<div ">
        <div">
            <img src="${c.flags.svg}" alt="Country flag">
            <h2> ${c.name.official}</h2>
        </div>
            <p">Capital:${c.capital}</p>
            <p>Population: ${c.population}</p>
            <p>Languages: ${Object.values(c.languages).join(',')}</p>
    </div>`;
  refs.countriesInfo.innerHTML = card;
}

function clearData() {
  refs.countriesList.innerHTML = '';
  refs.countriesInfo.innerHTML = '';
}
