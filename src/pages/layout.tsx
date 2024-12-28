import { Outlet } from "react-router-dom"
import { Header } from "../component/header"
import { Footer } from "../component/footer"


export function Layout() {
    return <div className='h-screen bg-blue-500'>
    <Header></Header>      
    <Outlet/>
    <Footer></Footer>
    </div>
}