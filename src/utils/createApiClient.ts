import fs from 'fs-extra';
import path from 'path';

export async function createApiClient() {
  const filePath = path.join(process.cwd(), 'src/services/api/client.ts');

  await fs.ensureDir(path.dirname(filePath));

  const content = `
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor
api.interceptors.request.use(
  async config => {
    // TODO: attach token here
    // const token = await getToken();
    // if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
  },
  error => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
  response => response.data,
  async error => {
    if (error.response?.status === 401) {
      // handle logout or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;
`;

  await fs.writeFile(filePath, content.trim());
}