const API_KEY = '43921619-d69945085d06baa690e6f0201';
const BASE_URL = 'https://pixabay.com/api/';
// Funcția getImage face o cerere către API-ul Pixabay pentru a obține imagini bazate pe un anumit query
const getImage = async (query, page = 1, perPage = 40) => {
  try {
    // Folosim funcția fetch pentru a face cererea către API-ul Pixabay
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    // Verificăm dacă răspunsul este valid
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    // Returnăm răspunsul sub formă de obiect JSON
    return response.json();
  } catch (error) {
    // Prindem orice eroare care apare și o afișăm în consolă
    console.error('Fetch error: ', error);
    throw error;
  }
};

export { getImage };
