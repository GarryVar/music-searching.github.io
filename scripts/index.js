const catalog = document.querySelector('.catalog');
const resultContainer = document.querySelector('.catalog__list');
const loading = document.querySelector('.loading');

const searchParams = {
  url: 'https://api.discogs.com/database', token: {
    secret: 'mNHcAvOinUcwHakAVnJbLZDKTHMXfogm', key: 'vDFrSJVinLBdseXePtFc'
  }, param: {
    key: `&key=`, search: `search?q=`, secret: `&secret=`,
  }
};

const {
  url, token: {key, secret}, param: {keyParam, secretParam, searchParam}
} = searchParams;


const onSubmitStart = () => {
  loading.innerHTML = `<span class="loading__loader"></span>`;
};

const renderTemplate = (item) => {
  loading.innerHTML = '';

  const li = document.createElement('li');

  li.classList.add(`catalog__item`);
  li.id = `${item['id']}`;
  li.innerHTML = `<a href="${item['resource_url']}" data-resource="${item['resource_url']}" target="_blank">

       <div class="catalog__img-wrap">
        <img src="${item['cover_image']}" width="190" height="190" alt="${item['title']}" loading="lazy" data-resource="${item['resource_url']}">
      </div>

      <h2>${item['title']}</h2>
     </a>`;

  return li;
};

const getResult = async (evt) => {

  try {
    evt.preventDefault();
    onSubmitStart();

    const searchValue = evt.target.elements[`searchInput`].value;

    const resp = await fetch(`${url}/search?q=${searchValue}&key=${key}&secret=${secret}`);
    const data = await resp.json();
    const {pagination, results} = data;

    results.forEach(res => resultContainer.appendChild(renderTemplate(res)));

  } catch (err) {
    console.log(`Ошибка ${err}`)
  }
};

const onSubmit = (evt) => {
  resultContainer.innerHTML = ``;
  onSubmitStart();

  getResult(evt).then(d => d);
}

document.querySelector('form').addEventListener('submit', onSubmit);

const showResource = async (url) => {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (err) {
    console.log(`Ошибка ${err}`)
  }
}

const showDetailsPage = (evt) => {
  evt.preventDefault();
  resultContainer.innerHTML = ``;
  let resourceUrl = evt.target.dataset.resource;

  showResource(resourceUrl).then(data => data);
}

catalog.addEventListener('click', showDetailsPage);



/*navigation*/

const nav = document.querySelector('.nav');
const toggle = document.querySelector('.toggle');
const burgerIcon = document.querySelector('.toggle__icon');

const toggleStates = (elem, selector) => {
  !elem.classList.contains(selector) ?
    elem.classList.add(selector) :
    elem.classList.remove(selector);
}
toggleStates(nav, 'hidden');

const onToggleNavigation = evt => {
  evt.preventDefault();

  toggleStates(nav, 'hidden');
  Array.from(burgerIcon.children)
    .forEach(item => toggleStates(item,'hidden'))
};

toggle.addEventListener('click', onToggleNavigation);
