const TOKEN_KEY = 'geek-pc'

const getToken = () => localStorage.getItem(TOKEN_KEY)
const setToken = (token) => {
  console.log(123)
  localStorage.setItem(TOKEN_KEY, token)
}
const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export { getToken, setToken, removeToken }