import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://deployment.url.now.sh/api'
    : 'http://76.16.17.161:3000/api';

export default axios.create({ baseURL });
