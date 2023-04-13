import axios from "axios"
const container = document.querySelector('.container')
const url = 'https://api.themoviedb.org/3/trending/movie/week?api_key=d66303a9f2f21ddca222463dbeed564f'
const genresUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=d66303a9f2f21ddca222463dbeed564f&language=en-US'
const buttons = document.querySelector('#buttons')
const pagination = document.querySelector('#paging')
const prevBtn = document.querySelector('#prev')

let currentPage = 1


function paginator(data) {
  let buttonsArray = []
  const { total_pages } = data
  for(let i = 1; i <= total_pages; i++) {
    const btn = document.createElement('button')
    btn.textContent = i
    buttonsArray.push(btn)
  }
  console.log(total_pages);
  
  buttonsArray.splice(6, (total_pages - 6))
  pagination.append(...buttonsArray)
}

buttons.addEventListener('click', e => {
  if(e.target.textContent === 'Next') {
    ++currentPage
    container.innerHTML = ''
    getTrendingMovies(currentPage)
  } else if (e.target.textContent === 'Prev' && currentPage > 1) {
    --currentPage
    container.innerHTML = ''
    getTrendingMovies(currentPage)
  }
})

pagination.addEventListener('click', e => {
  console.log(Number.parseInt(e.target.textContent));
  if (e.target.textContent === currentPage) {
    return
  } else {
    currentPage = Number.parseInt(e.target.textContent)
    container.innerHTML = ''
    getTrendingMovies(currentPage)
  }
})





async function getTrendingMovies(page) {
  const options = {
    params: {
      page
    }
  }
  try {
    const response = await axios.get(url, options)
    const result = response.data.results
    const data = response.data
    const genresResponse = await axios.get(genresUrl)
    const genresArray = genresResponse.data.genres
    result.forEach(el => {
      el.genres = []
      el.genre_ids.map(el2 => {
        for (let i = 0; i < genresArray.length; i++) {
          if (el2 === genresArray[i].id) {
            el.genres.push(genresArray[i].name)
          }
          
        }
      })
    });
    appendGallery(result)
    paginator(data)
  } catch (error) {
    console.log(error);
  }
}


function appendGallery(result) {
  container.insertAdjacentHTML(
    'afterbegin',
    result
      .map(({title, poster_path, release_date, id, genres}) => {
        const releaseDate = release_date.slice(0, 4)
        return `
          <div class="movie-card" data-id="${id}">
            <img 
            class="movie__image"
            src="https://image.tmdb.org/t/p/w500${poster_path}" 
            alt="${title}" 
            loading="lazy"          
            />
            <p class="movie__title">${title}</p>
            <p class="movie__genresAndReleaseDate">${genres} | ${releaseDate}</p>
          </div>
        `;
      })
      .join(''),
  );

}



getTrendingMovies()
