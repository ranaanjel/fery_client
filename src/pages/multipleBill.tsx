

import { PDFDownloadLink, PDFViewer , pdf} from "@react-pdf/renderer";
import {  useRef, useState, ReactNode } from "react"
import { DownloadLink, MyDocument } from "./pdf/pdfDoc";

interface IClientdata {
    name:string;
    addPh:string;
    preference:string;
    priority:string;
    timing:string;
}
export function MultipleBill() {
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const selectPriceRef = useRef<HTMLSelectElement | null>(null)
    //FC 
    const clientInputRef = useRef<HTMLInputElement| null>(null);
    const [clientListData, setClientListData] = useState<IClientdata>({name:"", addPh:"", preference:"", priority:"", timing:""})
    interface IlistItem{
        name:string,
        quantity:string,
        price:string,
        total:string
    }
    const [itemArray, setItemArray] = useState<IlistItem[] | []>([]);
    const totalRef = useRef<number>(0);
    const [customerArray, setCustomerArray] = useState<Record<string ,{name:string, quantity:string, price:string, total:string}[] > >();

//functions - utils


    function updateTheItem(){
     
       
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
            "kg":"kg", "gm":"gm", "g":"gm", "k":"kg", "kilo":"kg", "gram":"gm", "katta":"bag", "carton":"carton", "box":"box", "pkt":"pkt", "pkts":"pkts", "pcs":"pcs", "pc":"pcs","bunch":"bunch", "dozen":"dozen"
        }
        if(!selectPriceRef.current) {
            return ;
        }
        let divisionMultiple = selectPriceRef.current.value.includes("unit") ? "unit" : "total";

        if(input) {
            //format is quantity + unit + name - unit is optional
            //units are kg, gm , g , k , kilo, gram - quanity not provided then using the pkt for it.
           let allData = input.split("\n\n").filter(m => m);

          allData.forEach( m => {
            let fullData = m.split("\n")
            let customerName = fullData[0];
            let orders = fullData.slice(1).filter(m => m.trim()).filter(m => m.match(/[^\d.]+/));
            let structuredOrder:{name:string, quantity:string, price:string, total:string}[] = [];

    
            orders.forEach(m => {

                let words = m.split(/\s/).filter(m => m);
                let quantity = words[0];
                let unit = words[1];
                let itemname = words.slice(2).join(" ");

                if (unit == "g") {
                    unit = "gm"
                }
                if (unit == "k") {
                    unit = "kg"
                }

                 if(unit == "gm") {
                    quantity = String(parseFloat(quantity)/1000);
                    unit = "kg"
                }

                let newObject = {name: itemname, quantity:quantity + " "+ unit, price:"1", total:quantity};
                structuredOrder.push(newObject);

            })

            setCustomerArray(m => {

                if (!m) {
                    m = {};
                }
                let newData = {...m};
                newData[customerName] = structuredOrder;
                   return newData;
                })

          })

    

        //    var value = input.split("\n").filter(words => {  
        //     if(words.trim() == "") {
        //         return true;
        //     }
        //     let letters = words.split(" ").filter(m => m)

        //     let quantity = letters[0];
            
        //     let pattern = /[^\d.]+/;
        //     if(quantity.match(pattern)){
        //         return true;
        //     }

        //     let unit ;
        //     let item ;
        //     let price ;
        //     let total;

        //     if(letters[1] in objectUnit) {
        //         unit = objectUnit[letters[1]];
        //         //console.log(letters[letters.length-1].match(/[\d.]/));
        //         if(unit == "gm") {
        //             quantity = String(parseFloat(quantity)/1000);
        //             unit = "kg"
        //         }

        //         if(letters[letters.length-1].match(/[\d.]/)) {
        //             item = letters.slice(2,letters.length-1).join(' ');
        //             if(divisionMultiple == "unit") {

        //             price = letters[letters.length-1];
        //             total = Math.ceil(Number(String(parseFloat(price)*parseFloat(quantity)) ));
        //             }else {

        //             total = letters[letters.length-1];
        //             price = Math.ceil(Number(String(parseFloat(total)/parseFloat(quantity))));
        //             }

        //         }else {
        //             item = letters.slice(2,).join(' ');
        //             price = 0;
        //             total =  0;
        //         }
        //     }else {
        //         unit = " pcs";
                
        //         if(letters[letters.length-1].match(/[\d.]/)) {
        //             item = letters.slice(1,letters.length-1).join(' ');
        //             if(divisionMultiple == "unit") {
        //             price = letters[letters.length-1];
        //             total = Math.ceil(Number(String(parseFloat(price)*parseFloat(quantity))));
        //             }else {
                        
        //             total = letters[letters.length-1];
        //             price = Math.ceil(Number(String(parseFloat(total)/parseFloat(quantity))));
        //             }

        //         }else {
        //             item = letters.slice(1,).join(' ');
        //             price = 0;
        //             total =  0;
        //         }
        //     }

        //     //@ts-ignore
        //     let newObject:IlistItem = {name: item, quantity:quantity + " "+ unit, price:price, total:total};
           
        //     setItemArray(m => [...m, newObject])
        //    // console.log(quantity + " - " + unit +" " , "\n item name :" + item + " \nprice value : "+ price)
        //    return false;
        // });

        if(textRef.current) {
            textRef.current.value = " make sure nothing is left in the textarea"
         }
       
        }
    }

    function changedata(customer:string) {
        console.log(customer);

        if(customerArray) {
            let data = customerArray[customer]
            setClientListData(m => {
                return {...m,name:customer}
            })
            setItemArray(data)
        }

    }
   async function downloadAll() {

    if(customerArray ) {


        let arrayValue = Array.from(Object.entries(customerArray));

        for (let data of arrayValue) {

            console.log(data[0], data[1])
            let customerName = data[0].trim();
            
            let sum = 0;
            data[1].forEach(m => {
                sum += Number(m.total)
            })
            totalRef.current = sum;

        let blob = await pdf(<MyDocument currentClient={{name:customerName, addPh:"", preference:"", priority:"", timing:""}} items={data[1]} totalPrice={totalRef} type="mul"/>).toBlob();
        let url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = url;
        
        link.download = customerName + ".pdf";
        console.log(customerName)
        document.body.append(link);
        link.click();
        document.body.removeChild(link)
        URL.revokeObjectURL(url);
        }
        
    }
    }

    return <div className="p-4">
    <div className='h-[85vh] flex justify-start gap-4'>
      <GenericCard> 
        <div className=" w-full m-2 text-white  ">  
            <div className="text-xl mb-2">Example : </div>
            <pre>
                Restaurant Name 1<br/>
                quantity unit-name item-name <br/>
                quantity unit-name item-name <br/>
            </pre>
            <pre>
                \new-line
            </pre>
            <pre>
                Restaurant Name 2<br/>
                quantity unit-name item-name <br/>
                quantity unit-name item-name <br/> 
            </pre>

        </div>
         
        <div className="  flex w-full m-2 overflow-scroll h-[60%] ">  
            <div className=" h-full border-white border w-full" >
                <textarea ref={textRef} placeholder="Provide the information eg : item quantity price" name="item" className="w-full resize-none focus:outline-none p-2 h-full scroll-smooth text-white"></textarea>
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
        <div className="h-[80vh] overflow-scroll text-white">
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

    {
        <div className="flex-1 shadow-md rounded p-4 bg-blue-700 m-2 text-white ">

            <div>
                Customer List : 
            </div>

           <div className="flex gap-2 flex-wrap justify-center"> {
                customerArray && Array.from(Object.keys(customerArray)).map(m => {

                    return <div key={m} onClick={function () {
                        changedata(m)
                    }} className="border border-white rounded-md py-4 px-2 w-70 cursor-pointer">
                        {m}
                    </div>
                })
            }
            </div>
            
        </div>
    }

    <GenericCard >  
        <div className="justify-end flex">
        <DownloadLink clientInput={clientInputRef ? clientInputRef :""} />
        <PDFDownloadLink className=" p-2 border border-blue-700 bg-blue-950 text-white" document={<MyDocument currentClient={clientListData} items={itemArray} totalPrice={totalRef}/>} fileName="test.pdf">
           {({ loading }) => loading ? "Preparing PDF…" : "Download PDF"}
        </PDFDownloadLink>
        <button className=" p-2 border border-blue-700 bg-blue-950 text-white" title="no functioning">Download as CSV</button>
        <button onClick={downloadAll} className=" p-2 border border-blue-700 bg-blue-950 text-white cursor-pointer" title="no functioning">Download all pdf</button>
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