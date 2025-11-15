import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export function Header() {
    let linkClassName = "px-2 p-1 bg-blue-950 text-white hover:bg-white hover:text-blue-950 border border-gray-500 rounded"
    return <div className="flex justify-between px-[100px] items-center bg-blue-950/80 ">
        <h1 className='text-4xl text-white text-center tracking-[-2.5px]'>quikcrats
            <span ><img  className="size-20 inline" src={logo} alt="logo" /></span>
        </h1>
        
        <nav className="flex gap-4 items-center ">
            <Link className={linkClassName} to="/bill">Generate Bill</Link>
            <Link className={linkClassName} to="/item">Generate Item List</Link>
            <Link className={linkClassName} to="/client">Client Info</Link>
            <Link className={linkClassName} to="/inventory">Inventory</Link>
            <Link className={linkClassName} to="/customer-order">Daily Customer Order</Link>
            <Link className={linkClassName} to="/multipleBill">Generate Multiple Bill</Link>
        </nav>
      {/* <img src={logo} alt="logo" className="size-16"/> */}
    </div>
}