import axios from 'axios';

export const API_URL = 'https://uniao.herokuapp.com';

export const getIndexes = index => {
  return axios({
    url: `${API_URL}/search?index=${index}`,
    method: 'get',
  });
};
