import { makeAutoObservable } from 'mobx'
import { setToken, getToken, removeToken, http } from '@/utils'
class LoginStore {
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }

  login = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    this.token = res.data.token
    setToken(this.token)
  }

  // 退出登录
  loginOut = () => {
    this.token = ''
    removeToken()
  }
}
export default LoginStore