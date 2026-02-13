import Axios from 'axios'

const axios = Axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // 👈 これが「ポケットの合言葉を使う」命令
    xsrfCookieName: "XSRF-TOKEN", // 👈 これが「合言葉の名前」
    xsrfHeaderName: "X-XSRF-TOKEN", // 👈 これが「見せる時のヘッダー名」
});

export default axios;

