import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
// import Login from './pages/Login'
import Login from '@/pages/Login'
import { AutoRoute } from './components/AuthRoute'
import './App.scss'
import Home from './pages/Home'
import Article from './pages/Article'
import Publish from './pages/Publish'
import { HistoryRouter, history } from './utils/history'

function App () {
  return (
    <div className="App">
      <HistoryRouter history={history}>
        <Routes>
          <Route path='/' element={<AutoRoute><Layout /></AutoRoute>}>
            {/* 二级路由默认页面 */}
            <Route index element={<Home />} />
            <Route path="article" element={<Article />} />
            <Route path="publish" element={<Publish />} />
          </Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </HistoryRouter>
    </div>
  )
}

export default App
