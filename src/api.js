import axios from 'axios'
import router from './router'

let api = 'http://10.0.203.60:3000/'





export default {
  getWYSingerList(data) {
    return axios.get(`${api}top/artists`, {
      params: data
    });
  },
  getWYSingerMusicList(data) {
    return axios.get(`${api}artists`, {
      params: data
    });
  },
  getWYLyric(data) {
    return axios.get(`${api}lyric`, {
      params: data
    });
  }
}