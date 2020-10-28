import axios from 'axios';

export function register(payload) {
  return axios.post('/api/user/register', {
    ...payload,
  });
}
/**
 * 获取公钥
 */
export function getPublicKey() {
  return axios.get('/api/key/getPublicKey');
}
