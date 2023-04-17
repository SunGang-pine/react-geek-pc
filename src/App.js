import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
// import Login from './pages/Login'
import Login from '@/pages/Login'
import { Button } from 'antd'

function App () {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
      <Button type="primary">Button</Button>
    </div>
  )
}

export default App
