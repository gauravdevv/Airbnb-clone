
import './App.css'
import {Route, Routes} from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { ContextProvider } from './components/UserContext'
import AccountPage from './pages/AccountPage'
import PlacePage from './pages/PlacePage'
import PlaceFormPage from './pages/PlaceFormPage'

axios.defaults.baseURL= 'http://127.0.0.1:7002'
axios.defaults.withCredentials = true

function App() {
  return (
    <ContextProvider>
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<IndexPage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path="/account" element={<AccountPage/>} />
      <Route path="/account/places" element={<PlacePage/>} />
      <Route path="/account/places/new" element={<PlaceFormPage/>} />
      <Route path="/account/places/:id" element={<PlaceFormPage/>} />
      </Route>
    </Routes>
    </ContextProvider>
     
  )
}

export default App
