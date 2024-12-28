import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export function Header() {
    return <div className="flex justify-between px-[100px]  items-center bg-blue-800 bg-opacity-50 ">
        <h1 className='text-4xl text-white text-center tracking-[-4px]'>fery
            <span ><img  className="size-20 inline" src={logo} alt="logo" /></span>
        </h1>
        
        <nav className="flex gap-4 items-center ">
            <Link className="px-2 p-1 bg-blue-950 text-white hover:bg-white hover:text-blue-950" to="/bill">Generate Bill</Link>
            <Link className="px-2 py-1 bg-blue-950 text-white hover:bg-white hover:text-blue-950" to="/item">Generate Item List</Link>
            <Link className="px-2 py-1 bg-blue-950 text-white hover:bg-white hover:text-blue-950" to="/client">Client Info</Link>
            <Link className="px-2 py-1 bg-blue-950 text-white hover:bg-white hover:text-blue-950" to="/inventory">Inventory</Link>
        </nav>
      {/* <img src={logo} alt="logo" className="size-16"/> */}
    </div>
}