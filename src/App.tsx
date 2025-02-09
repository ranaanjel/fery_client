import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './pages/layout'
import { Bill } from './pages/bill'
import { ItemList } from './pages/itemList'
import { ClientList } from './pages/client'
import { ItemCategoriesList } from './pages/itemDB'

//running the localstorage for the items and client



function App() {
  // const currentDate = new Date()

  return <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index path="/client" element={<ClientList/>} ></Route>
          <Route path="/bill" element={<Bill/>} ></Route>
          <Route path="/item" element={<ItemList/>} ></Route>
          <Route path="/inventory" element={<ItemCategoriesList/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
  
}

export default App
