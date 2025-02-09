// import { ReactElement } from "react"

import { PDFViewer } from "@react-pdf/renderer";
import {  useRef, useState, ReactNode } from "react"
import { DownloadLink, MyDocument } from "./pdf/pdfDoc";
import { SelectElem , FunctionTiming} from "../component/select";
import { findClient , selectTheValue} from "../utils/utils";


interface IClientdata {
    name:string;
    addPh:string;
    preference:string;
    priority:string;
    timing:string;
}
export function Bill() {

    let timeRefInput = useRef<HTMLInputElement|null>(null)
    let meridanRefSelect = useRef<HTMLSelectElement|null>(null)
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const selectPriceRef = useRef<HTMLSelectElement | null>(null)
    //FC 
    const clientInputRef = useRef<HTMLInputElement| null>(null);
    const [searchClient, setSearchClient] = useState<string[]>([])
    const [clientListData, setClientListData] = useState<IClientdata>({name:"", addPh:"", preference:"", priority:"", timing:""})
    interface IlistItem{
        name:string,
        quantity:string,
        price:string,
        total:string
    }
    const [itemArray, setItemArray] = useState<IlistItem[] | []>([]);
    const totalRef = useRef<number>(0);



function ClientDesc({name, address, preferences, timing, priority}: {name:string, address:string, preferences:string, timing?:string, priority:string }) {


    const priRef = useRef<HTMLSelectElement| null>(null)
    const prefRef = useRef<HTMLSelectElement| null>(null)
  //  console.log(timing, " value is provided")

    return <div className="pt-2 pb-2 font-san text-gray-50 bg-blue-800  flex flex-col items-start justify-between h-full px-4 w-[100%]">
        <div>Client : {name}</div>
        <div>Address & contact: <div>
            {address}</div></div>
        <div>Preference: <br/>
            <SelectElem currentData={preferences} reference={prefRef} setClientListData={setClientListData}/>
        </div>
        <div>Priority: <br/>
           <SelectElem currentData={priority} reference={priRef} setClientListData={setClientListData} />
            </div> 
        <div>Timing: <br/>
            {timing}
            <FunctionTiming timeRefInput={timeRefInput} meridanRefSelect={meridanRefSelect} timing={timing}/>
        </div>
    </div>

}
//functions - utils

    function findDetails() {
         var stringVal = (clientInputRef.current?.value)
        if(stringVal =="" ) {
            setSearchClient([])
            return;
        }

        var listOfClient = JSON.parse(localStorage.getItem("client") as string);
        if(!listOfClient.clientList ) {
            return;
        }
        if(!listOfClient.clientList.includes(stringVal)) {
            alert("no such client")
            return;
        }

        var newData = listOfClient.data[stringVal as string];

        setClientListData(() => {
            return newData;
        })
        //console.log(newData)
    }
    
    function updateTheItem(){
        if(clientListData.name == "" ) {
            alert("select the client");
            return;
        }
        let timeValue = timeRefInput.current?.value;

        if(timeValue == "" && timeRefInput.current && meridanRefSelect.current) {
            //adding the default value to be 8:00 to 10:00 AM
            timeRefInput.current.value = "8-10";
            meridanRefSelect.current.value = "AM";
        }
        //updating the time value of the vendor - for last value.
        var listOfClient = JSON.parse(localStorage.getItem("client") as string);
            if(!listOfClient.data ) {
                return;
                }
        listOfClient.data[clientListData.name]["timing"] = timeRefInput.current?.value +" "+ meridanRefSelect.current?.value;
        localStorage.setItem("client", JSON.stringify(listOfClient))
        
        if(textRef.current?.value == ""){
            textRef.current.placeholder = "please add some value to it \n eg : Name Quanity Price";

            return;
        }
        // console.log(textRef.current?.value)
        processTheText(textRef.current?.value);
       // localStorage.setItem("client", JSON.stringify(listOfClient)); 
        
    }

    function processTheText(input:string|undefined) {
        //map creating 
        let objectUnit:any = {
            "kg":"kg", "gm":"gm", "g":"gm", "k":"kg", "kilo":"kg", "gram":"gm"
        }
        if(!selectPriceRef.current) {
            return ;
        }
        let divisionMultiple = selectPriceRef.current.value.includes("unit") ? "unit" : "total";
        
        console.log(divisionMultiple, input)

        if(input) {
            //format is quantity + unit + name - unit is optional
            //units are kg, gm , g , k , kilo, gram - quanity not provided then using the pkt for it.

           var value= input.split("\n").filter(words => {  
            if(words.trim() == "") {
                return true;
            }
            let letters = words.split(" ")

            let quantity = letters[0];
            
            let pattern = /[^\d.]+/;
            if(quantity.match(pattern)){
                return true;
            }

            let unit ;
            let item ;
            let price ;
            let total;

            if(letters[1] in objectUnit) {
                unit = objectUnit[letters[1]];
                //console.log(letters[letters.length-1].match(/[\d.]/));
                if(unit == "gm") {
                    quantity = String(parseInt(quantity)/1000);
                    unit = "kg"
                }

                if(letters[letters.length-1].match(/[\d.]/)) {
                    item = letters.slice(2,letters.length-1).join(' ');
                    if(divisionMultiple == "unit") {

                    price = letters[letters.length-1];
                    total = String(parseInt(price)*parseFloat(quantity));
                    }else {

                    total = letters[letters.length-1];
                    price = String(parseInt(total)/parseFloat(quantity));
                    }

                }else {
                    item = letters.slice(2,).join(' ');
                    price = 0;
                    total =  0;
                }
            }else {
                unit = " pcs";
                
                if(letters[letters.length-1].match(/[\d.]/)) {
                    item = letters.slice(1,letters.length-1).join(' ');
                    if(divisionMultiple == "unit") {
                    price = letters[letters.length-1];
                    total = String(parseInt(price)*parseInt(quantity));
                    }else {
                        
                    total = letters[letters.length-1];
                    price = String(parseInt(total)/parseInt(quantity));
                    }

                }else {
                    item = letters.slice(1,).join(' ');
                    price = 0;
                    total =  0;
                }
            }

            //@ts-ignore
            let newObject:IlistItem = {name: item, quantity:quantity + " "+ unit, price:price, total:total};
           
            setItemArray(m => [...m, newObject])
           // console.log(quantity + " - " + unit +" " , "\n item name :" + item + " \nprice value : "+ price)
           return false;
        });

        if(textRef.current) {
            textRef.current.value = value.join("\n")
        }
        }
    }

    return <div className="p-4">
    <div className='h-[85vh] flex justify-start gap-4'>
      <GenericCard> 
        <h2 className="text-white text-2xl">Client </h2>
        <div className="flex justify-between gap-2 relative">
            <input type="text" placeholder="search client" title="Either find and add" className="p-2 w-[90%] focus:outline-none" ref={clientInputRef} onChange={function (){
                findClient(setSearchClient, clientInputRef);
                }} />
            <div className="absolute top-10 w-[89.5%]">
                {searchClient.map((m,index) => {
                return <div key={index} onClick={function (e:any){
                    selectTheValue(e, clientInputRef, setSearchClient)
                    }} className="hover:bg-blue-200 hover:text-blue-950 cursor-pointer px-4 py-2 border bg-blue-800 text-white w-[100%]" > 
                  {m}
                </div>
            })}
            </div>

            <button className="p-2 border border-blue-700 bg-blue-950 text-white hover:bg-white hover:text-blue-700 rounded-md" onClick={function(){
                setItemArray([])
                findDetails();

            }}>Search</button>
            {/* creating custom input search list for it */}
        </div>
        <div className="  flex justify-between m-2 overflow-scroll h-[80%] gap-4">
            <div >
                <ClientDesc name={clientListData.name} preferences={clientListData.preference} timing={clientListData.timing} address={clientListData.addPh} priority={clientListData.priority}></ClientDesc>
            </div>
            <div className="min-w-[60%]  h-full border" >
                <textarea ref={textRef} placeholder="Provide the information eg : item quantity price" name="item" className="w-full resize-none focus:outline-none p-2 h-full"></textarea>
            </div>
        </div>
        <div className="flex justify-center gap-4">
            <button  onClick={updateTheItem} className="border px-4 py-2 bg-blue-950 text-white hover:bg-white hover:text-blue-700 rounded-md ">Update the item list</button>
        <select ref={selectPriceRef} className="px-2 py-1 bg-blue-950 text-white " name="price-value">
            <option value="total">total price</option>
            <option selected value="per unit">Per Unit</option>
        </select>
        </div>
      </GenericCard>
      <GenericCard>
        <div className="h-[80vh] overflow-scroll border">
            <table className="table-auto border-collapse">
            <thead className="border-collapse border-slate-500 text-white ">
                <th >Item Name</th>
                <th >Quantity</th>
                <th >Price Per Unit</th>
                <th>Total Price</th>
            </thead>
            {itemArray.map((m:IlistItem, index:number) => {
              
                return <ItemTable key={index} name={m.name} quantity={m.quantity} price={m.price} total={m.total}/>
            })}
            <tfoot>
                <td>Total:  </td>
                <td></td>
                <td></td>
                 
                <td>₹ {itemArray.length > 0 ? (function(){
                    var totalResult= String(itemArray.map(m => parseFloat(m.total)).reduce((item:number, target:number ):number => {
                    return (item) + (target)},0 ));
                    totalRef.current = Number(totalResult);
                    //setTotalPrice()
                    return totalResult;
                })(): "" }</td>     
            </tfoot>
        </table>
        </div>
      </GenericCard>
    </div>

    <GenericCard >  
        <div className="justify-end flex">
        <DownloadLink clientInput={clientInputRef ? clientInputRef :""} />
        <button className=" p-2 border border-blue-700 bg-blue-950 text-white" title="no functioning">Download as CSV</button>
        </div>
        <div className="h-[80vh]">
            <div className="border m-4 border-white h-[100%]">
            <PDFViewer width={"100%"} height={"100%"}>
                <MyDocument currentClient={clientListData} items={itemArray} totalPrice={totalRef}/>
            </PDFViewer>
            </div>
        </div>
    </GenericCard>
    </div>
}


function ItemTable({name, price, quantity, total}: {name:string, price:string, quantity:string, total:string}) {
    return <tbody>
        <td>{name}</td>
        <td>{quantity}</td>
        <td>{price}</td>
        <td>{total}</td>
    </tbody>
}

export function GenericCard({children}:{children:ReactNode| String}) {
    return <div className="flex-1 shadow-md rounded p-4 bg-blue-700 m-2">{children}</div>
}