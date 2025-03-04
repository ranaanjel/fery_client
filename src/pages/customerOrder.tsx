import { useNavigate } from "react-router-dom"
import { AddNewItemInventory, SelectElement } from "./itemDB"

export function CustomerOrderList() {
    let navigate = useNavigate()
    let buttonClass = "border p-2 rounded hover:bg-blue-950 cursor-pointer w-1/4 px-2";
    let inputTextClass = "border rounded h-[98%] bg-blue-950 px-2 ";
    let rowClass = "flex gap-2  m-auto justify-center items-center h-12 my-2";

    return <div className="bg-blue-800/90 w-[90%] m-auto text-white py-8 px-6 ">
        <div className="border rounded flex justify-between">
            <div className="w-[50%] p-6">
                <div className="my-4">  
                    <div className={rowClass}>
                        <input type="text" className={inputTextClass + " w-3/4"}/>
                        <button className={buttonClass}>select</button>
                    </div>
                    <p>Customer Name :</p>
                </div>
                <div className={rowClass}>
                    <label htmlFor="item-name" className="w-1/5">item name:</label>
                    <input id="item-name" className={inputTextClass +" flex-1"} placeholder="itemname" type="text" />
                    <button onClick={function(){
                        // navigate("/")
                    }} className={buttonClass}>create</button>
                    {/*using the search bar - in case of not there prompting user to create one */}
                </div>
                <div className={rowClass}>
                    <label htmlFor="category-name" className="w-1/5">Category Name:</label>
                    <SelectElement id="category-name" /> 
                    {/* {adding the class here} */}
                </div>
                <div className={rowClass}>
                    <label htmlFor="quanity-name" className="w-1/5">Quantity :</label>
                    <input placeholder="1" id="quantity-name" className={inputTextClass + " flex-1"} type="number" />
                </div>
                <div className={rowClass}>
                    <label htmlFor="unitname" className="w-1/5">unit :</label>
                    <input placeholder="kg" list="unitnames" id="unitname" name="unitname" className={inputTextClass +" flex-1"}/>
                    <datalist id="unitnames">
                    <option value="pcs"/>
                    <option value="kg"/>
                    <option value="gm"/>
                    </datalist>
                </div>
                <div className={rowClass+" h-16"}>
                    <button className={buttonClass+" w-1/3 h-16"}>update the list</button>
                    
                </div>
            </div>
            <div className="w-[50%] p-6 text-center ">
                <div className="w-full border h-96 bg-blue-900 mb-2 overflow-sc select-none">
                    <div className="m-7">
                        customer name : <span className="text-yellow-300">_______</span>
                    </div>
                    <div className="list-head text-gray-500 text-green-500">
                      <pre>  quantity   unit    item_name    category </pre>
                    </div>
                    
                    <div className="list-item text-gray-500">
                      <pre>  1   kg    item_name    category </pre>
                    </div>
                {/* ability to delete the item list from here */}
                
                </div>
                <div className="h-16 flex flex-row gap-4 justify-center ">
                    <button className={buttonClass+" h-16"}>done with list</button>
                    <AddNewItemInventory/>
                </div>
            </div>
        </div>
        <div className="border rounded flex justify-between mt-2" >
            <div className="w-[50%] p-4">
                <p className="text-2xl">customer list : </p>
                <div className="flex flex-wrap m-4 gap-4"> 
                    <div className="border bg-blue-950 rounded p-2 w-1/5 text-center hidden">
                        customer 1 , test sample
                    </div>
                    
                </div>
            </div>
            <div className="w-[50%] p-4 ">
                <p className="text-2xl my-2">copy to clipboard:</p>
               <div className="flex justify-center gap-6">
                     <button className={buttonClass}>
                    current customer selected
                     </button>
                    <button className={buttonClass}>
                        all customer items list
                    </button>
               </div>
            </div>
        </div>
    </div>
}

