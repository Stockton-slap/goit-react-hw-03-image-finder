import axios from 'axios';

const fetchImages = (imageName, page) => {
  const BASE_URL = 'https://pixabay.com';

  const searchParams = new URLSearchParams({
    page,
    key: '30589696-b681d27f2a9352756d0078443',
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 12,
  });

  return axios.get(`${BASE_URL}/api/?q=${imageName}&${searchParams}`);
};

export default fetchImages;
