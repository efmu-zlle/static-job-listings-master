const container__search = document.querySelector('.container__search');
const search__right = document.querySelector('.search__right');
const clear = document.getElementById('clear');

//Para mantener los datos del fecth guardados
let jobsArray = [];
// Para mantener los datos de la barra del buscardor
let searchArray = [];

const fetchingJobs = async () => {
    try {
        const response = await fetch('data.json');
        jobsArray = await response.json();
        jobsArray = jobsArray.map(jobs => {
            return {
                compania: jobs.company,
                contrato: jobs.contract,
                destacado: jobs.featured,
                id: jobs.id,
                ubicacion: jobs.location,
                posicion: jobs.position,
                logo: jobs.logo,
                nuevo: jobs.new,
                etiquetas: [jobs.role, jobs.level, ...(jobs.languages) || [], ...(jobs.tools) || []],
                publicado: jobs.postedAt
            };
        });
        displayJobs(jobsArray);
    } catch (error) {
        console.error(error);
    }
};

const displayJobs = (jobs) => {
    const htmlString = jobs
            .map((jobs) => {
                return `<div class="card">
                    <!-- tarjeta izquierda -->
                        <div class="top__card">
                        <div class="icon">
                            <img src="${jobs.logo}" alt="${jobs.compania}">
                        </div>
                        <div class="header__ele">
                            <strong class="company">${jobs.compania}</strong>
                            ${jobs.nuevo ? `<strong class="new">New!</strong>` : ``}
                            ${jobs.destacado ? `<strong class="featured">Featured</strong>` : ``}
                        </div>
                        <div class="header__title">
                            <strong>${jobs.posicion}</strong>
                        </div>
                        <div class="header__info">
                            <ul>
                            <li>${jobs.publicado}</li>
                            <li>${jobs.contrato}</li>
                            <li>${jobs.ubicacion}</li>
                            </ul>
                        </div>
                        </div>
                        <!-- fin tarjeta izquierda -->
                        
                        <!-- inicio tarjeta derecha -->
                        <div class="bottom__card">
                        ${jobs.etiquetas.map(tag => `<button data-info="${tag}">${tag}</button>`).join('')}
                        </div>
                    </div>  
                        <!-- fin tarjeta derecha -->`;
                }).join('');

    document.getElementById('container__card').innerHTML = htmlString;
};

const addfilterSearch = (tagToFilter) => {
    let button = document.createElement('button');
    let span = document.createElement('span');

    if (!searchArray.includes(tagToFilter)) {
        container__search.classList.remove('hidden');
        span.textContent = tagToFilter;
        span.classList.add(tagToFilter);
        span.appendChild(button);
        search__right.append(span);
        searchArray.push(tagToFilter);
    } else { 
        removeTagsSearch(tagToFilter);      
    }

    updateSearchFilter();
};

const removeTagsSearch = tagToDelete => {
    let indexToRemove = searchArray.indexOf(tagToDelete);

    searchArray.splice(indexToRemove, 1);
    if (searchArray.length === 0) {
        container__search.classList.add('hidden');
    }
    let removeTag = search__right.querySelector(`.${tagToDelete}`);
    search__right.removeChild(removeTag); 

    updateSearchFilter();
};

const updateSearchFilter = () => {
    let filterSearchTags = jobsArray.filter(job => searchArray.every(tag => job.etiquetas.includes(tag)));
    displayJobs(filterSearchTags);
};

clear.addEventListener('click', () => {
    search__right.querySelectorAll('span').forEach(tag => {
        search__right.removeChild(tag);
    });
    searchArray = [];

    if (searchArray.length === 0) {
        container__search.classList.add('hidden');
        updateSearchFilter();
    }
});

window.addEventListener('click', (e) => {
    let targetTag = e.target.getAttribute('data-info');
    if (e.target.getAttribute('data-info')) {
        addfilterSearch(targetTag);
    }

    if (e.target.outerHTML === '<button></button>') {
        let tagToDelete = e.path[1].textContent;
        if (searchArray.includes(tagToDelete)) {
            removeTagsSearch(tagToDelete);
        }
    }
});

fetchingJobs();


