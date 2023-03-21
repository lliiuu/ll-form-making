import axios from 'axios'
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

function getToken() {
  let str = Cookies.get(TokenKey);
  return str != undefined && str.length > 0 ? JSON.parse(str) : "";
}
const request = axios.create({
  withCredentials: false
})

request.interceptors.request.use(
  config => {
    let token = getToken();
    if (token != undefined) {
            config.headers.token = token.token;
        }
    return config
  },
  error => {
    console.log('error', error)
    return Promise.reject(new Error(error).message)
  }
)

request.interceptors.response.use(
  response => {
    console.log('.....', response)
    return response.data
  },
  error => {
    console.log('error', error)
    return Promise.reject(new Error(error).message)
  }
)

export default request
