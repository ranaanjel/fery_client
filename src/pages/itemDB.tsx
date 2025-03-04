export function ItemCategoriesList() {

    let buttonClass = "border p-2 rounded hover:bg-blue-950 cursor-pointer w-1/5 h-[100%]"
    let rowClass = "flex gap-6 w-[60%] m-auto justify-center items-center h-16" 
    return <div className="bg-blue-800/90 w-[90%] m-auto text-white py-8 px-6 flex flex-col gap-10">
        <div className={rowClass}>
            <label htmlFor="file" className="bg-blue-900 hover:bg-blue-950 p-2 rounded cursor-pointer border-dashed text-center w-1/3 border-2 border-blue-300 h-[100%]"> 📎 click to upload <br/>  JSON file</label>
            <input accept=".json" type="file" name="" id="file" className=" bg-blue-950 hidden "/>
             <SelectElement id="file"/>
            <button className={buttonClass}>Update the Data</button>
        </div>
        <div className={rowClass }>
            <AddNewItemInventory/>
        </div>
        <div className={rowClass }>
            <p className="text-xl underline w-1/3 flex-1 whitespace-nowrap">Individual Item Information :</p>
            <input type="text" name="" id="" className="flex-1 border rounded h-[100%] bg-blue-950 px-2"/>
            <SelectElement id="individual-item"/>
            <button className={buttonClass +" flex-1"}>Get Info</button> 
        </div>
        <div className={rowClass}>
            <p className="text-xl underline w-1/3 whitespace-nowrap">Category Listing Information :</p>
            <SelectElement id="category-item"/>
            <button className={buttonClass}>Get Info</button>
        </div>
        <div className={rowClass + " h-auto"}>
            <textarea rows={24} className="w-[100%] border bg-blue-950 resize-none rounded focus:outline-none p-4" name="" id="" placeholder="the data will shown here" >
            </textarea>
        </div>
        <div className={"w-[60%] m-auto h-24"}>
            <p className="text-center text-2xl">clipboard 📋</p>
            <div className="flex flex-row w-[100%] gap-5 justify-center mt-2 h-[100%]">
                <button className={"cursor-pointer border w-1/3 hover:bg-blue-950 px-6 rounded h-16"}>
                  Individual Items 
                 </button>
                <button className={"cursor-pointer border w-1/3 hover:bg-blue-950 px-6 rounded h-16"}>
                   cumulative items with pricing
                </button>
            </div>
        </div>
    </div>
}

export function SelectElement({id}:{id?:string}) {
    return <select name="category-list" id={id} className="border w-1/3 bg-blue-950 px-6 rounded h-[100%] flex-1">
                <option disabled selected value="--">Select the Category</option>
                <option value="vegetables">vegetables</option>
                <option value="packaging materials">packaging materials</option>
                <option value="dairy sauces confectionary">dairy, sauces & confectionary</option>
                <option value="cleaning consumables">cleaning & consumables</option>
                <option value="ration oil">ration & oil</option>
                <option value="spices">masala & spices</option>
            </select>
}

export function AddNewItemInventory() {
    let buttonClass = "border p-2 rounded hover:bg-blue-950 cursor-pointer w-1/4 h-16"
    return <button className={buttonClass}>
                + new items / update items
            </button>
}