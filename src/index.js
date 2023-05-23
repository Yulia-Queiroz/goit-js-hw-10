import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput(evt) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  const inputValue = evt.target.value.trim();

  if (inputValue === '') {
    return;
  }

  fetchCountries(inputValue)
    .then(country => {
      checkConditions(country);
    })
    .catch(error => {
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      } else Notify.failure(error.message);
    });

  function checkConditions(country) {
    if (country.length > 10) {
      return Notify.warning(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (country.length === 1) {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return createCountryMarkup(country);
    }
    return createCountryList(country);
  }

  function createCountryMarkup(country) {
    const markup = country
      .map(({ name, capital, population, flags, languages }) => {
        return `<div class="country-title"><img class="flag-img" src ="${
          flags.svg
        }", width ="40px"> ${name.official}</div> 
          <div class="country-info">Capital:<span class="info-span"> ${capital}</span></div>
          <div class="country-info">Population:<span class="info-span"> ${population}</span></div>
          <div class="country-info">Languages:<span class="info-span"> ${Object.values(
            languages
          ).join(', ')}</span></div>`;
      })
      .join('');

    countryInfo.insertAdjacentHTML('beforeend', markup);
  }

  function createCountryList(country) {
    const markup = country
      .map(({ flags, name }) => {
        return `<li class='list-item'><img class="flag-img" src ="${flags.svg}", width ='30px'> ${name.official}</li>`;
      })
      .join('');

    countryList.insertAdjacentHTML('beforeend', markup);
  }
}
