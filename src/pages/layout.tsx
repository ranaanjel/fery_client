import { Outlet } from "react-router-dom"
import { Header } from "../component/header"
import { Footer } from "../component/footer"
// import { backgroundImage } from "../utils/imageBackage"


export function Layout() {
    return <div className="h-auto min-h-screen  flex flex-col justify-between bg-(image:--background-image)">
    <Header></Header>
    <Outlet/>
    <Footer></Footer>
    </div>
}