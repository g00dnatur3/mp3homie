import axios from 'axios';

export const search = async (text: String) => {
  // tslint:disable-next-line:no-console
  console.log('ApiHelper.search', text)
  const res = await axios.post('/api/search', {text})
  return res ? res.data : res;
}

export const getDownloadUrl = (id: String, clientId) => `/api/download?id=${id}&clientId=${clientId}`

export const getDownloadVideoUrl = (id: String, clientId) => `/api/downloadvideo?id=${id}&clientId=${clientId}`
