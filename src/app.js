// Importăm biblioteca Notiflix pentru notificări și SimpleLightbox pentru lightbox-ul imaginilor
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Selectăm elementele DOM relevante
const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('form');
const loadMoreBtn = document.querySelector('.load-more');

// Inițializăm variabilele pentru paginare și căutare
let currentPage = 1;
let currentQuery = '';
const perPage = 40;

// Variabilă pentru a stoca instanța SimpleLightbox
let lightbox;

// Funcția pentru actualizarea interfeței utilizatorului cu imaginile
const updateUi = data => {
  const images = data.hits;

  // Verificăm dacă nu s-au găsit imagini
  if (images.length === 0) {
    Notiflix.Notify.failure('No results found. Please try a different query.');
  } else {
    // Notificăm utilizatorul că s-au găsit imagini și afișăm numărul total de imagini găsite
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  // Golim galeria doar la o căutare nouă (currentPage === 1)
  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  // Iterăm prin fiecare imagine și o adăugăm în galerie
  for (const image of images) {
    gallery.innerHTML += `
      <div class="photo-card">
        <a href="${image.largeImageURL}"><img class="small-img big-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${image.likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${image.views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${image.comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${image.downloads}</span>
          </p>
        </div>
      </div>
    `;
  }

  // Inițializăm sau reîmprospătăm SimpleLightbox pentru imaginile noi
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt', // Afișează titlul imaginii ca și caption
      captionDelay: 250, // Delay pentru afișarea caption-ului
    });
  }
};

// Funcție pentru a obține informații despre imaginile căutate
const imagesInfo = async (search, page = 1) => {
  const imageInfo = await getImage(search, page, perPage);
  return imageInfo;
};

// Eveniment pentru căutarea imaginilor
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const searchInputValue = searchForm.searchQuery.value.trim();
  if (!searchInputValue) {
    gallery.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    return;
  }
  currentPage = 1;
  currentQuery = searchInputValue; // Setăm căutarea curentă pentru cererile viitoare
  loadMoreBtn.style.display = 'none';

  // Obținem informații despre imaginile căutate și actualizăm UI-ul
  imagesInfo(currentQuery, currentPage)
    .then(data => {
      updateUi(data);
      if (data.hits.length === 0) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
      if (currentPage * perPage >= data.totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => {
      console.error(err);
      Notiflix.Notify.failure('Something went wrong. Please try again.');
    });
});

// Eveniment pentru încărcarea mai multor imagini
loadMoreBtn.addEventListener('click', () => {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  currentPage += 1;

  // Obținem informații despre imagini pentru pagina următoare și actualizăm UI-ul
  imagesInfo(currentQuery, currentPage)
    .then(data => {
      updateUi(data);
      if (currentPage * perPage >= data.totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => {
      console.error(err);
      Notiflix.Notify.failure('Something went wrong. Please try again.');
    });
});
