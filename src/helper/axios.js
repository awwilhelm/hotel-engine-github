import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.github.com/',
  timeout: 2000,
  headers: {'Accept': 'application/vnd.github.v3+json'}
});

export default instance;