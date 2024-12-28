import { PDFViewer } from "@react-pdf/renderer";
import {  ReactNode, useRef, useState } from "react"
import { MyItem } from "./pdf/pdfdoc2";
import { MyItem2 } from "./pdf/itemAllDoc";
import { WrongModal } from "../component/wrongClientModal";
import { clientInDataBase } from "../utils/utils";

interface IClientdata {
    name:string;
    addPh:string;
    preference:string;
    priority:string;
    timing:string;
}

export function ItemList() {

    const warningDivRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    //FC 
    //@ts-ignore
    const [clientListData, setClientListData] = useState<IClientdata>({name:"", addPh:"", preference:"", priority:"", timing:""})
    interface IlistItem{
        name:string,
        quantity:string,
        category:string,
        room:string
    }
    const [itemArray, setItemArray] = useState<IlistItem[] | []>([]);
    const totalRef = useRef<number>(0);
    const [currentClient, setCurrentClient] = useState<string[]| []>([]);
    // const currentClientItemsRef = useRef< Map<string, string[] | undefined>>(new Map());
    const currentClientItemsRef =  useRef<Record<string, IlistItem[]>>({});
    const [diffPDF , setDiffPDF] = useState(false);
    const currentAllValuePDF = useRef<Record<string, IlistItem[]>>({});
    const currentUserForPDF = useRef("");
    const wrongClient = useRef<string[] >([]);
    const [updateWrongClient, setWrongClient] = useState(false);
    const [tallyTrue, setTallyTrue] = useState(false);

// function ClientDesc({name, address, preferences, timing, priority}: {name:string, address:string, preferences:string, timing?:string, priority:string }) {

//     const priRef = useRef<HTMLSelectElement| null>(null)
//     const prefRef = useRef<HTMLSelectElement| null>(null)
//   //  console.log(timing, " value is provided")

//     return <div className="pt-2 pb-2 font-san text-gray-50 bg-blue-800  flex flex-col items-start justify-between h-full px-4 w-[100%]">
//         <div>Client : {name}</div>
//         <div>Address & contact: <div>
//             {address}</div></div>
//         <div>Preference: <br/>
//             <SelectElem currentData={preferences} reference={prefRef} setClientListData={setClientListData}/>
//         </div>
//         <div>Priority: <br/>
//            <SelectElem currentData={priority} reference={priRef}  setClientListData={setClientListData}/>
//             </div> 
//         <div>Timing: <br/>
//             {timing}
//             <FunctionTiming timeRefInput={timeRefInput} meridanRefSelect={meridanRefSelect} timing={timing}/>
//         </div>
//     </div>

// }
//functions

       //incremental search
    
    function updateTheItem(){
        let data = (textRef.current?.value.split(/\n\n+/))
        if(!data) {
            return;
        }
        if(data[0] == "" ) return;
        let allClient:string[] = []
       data.forEach((m,index) => {
        let clientName = m.split("\n")[0] as string;

        if(clientName.trim() == "") {
            return;
        }

        clientName = clientName.toLowerCase().trim();
         let newObj = Object.assign([], wrongClient.current);
        //console.log(clientName)

        if(!clientInDataBase(clientName)) {
            console.log("client not in the database please add the client and we are thinking this is one time and moving on");
            //alert("not in the DB but still moving client : " + clientName);
           
            newObj.push(clientName)
            wrongClient.current = newObj;
            //poping up the giving out the name ;
            //console.log(wrongClient)
        }
        allClient.push(clientName)
        let eachClientItems =processTheText(m);
        let newItemList = Object.assign({},currentClientItemsRef.current);
        //console.log(eachClientItems)
        //@ts-ignore
        newItemList[clientName.trim()] = eachClientItems;
        currentClientItemsRef.current = newItemList;
        //console.log(currentClientItemsRef.current, eachClientItems)

        if(newObj.length&& index == data.length -1 ) {
            setWrongClient(m => !m)
        }
       })
       //console.log(allClient, currentClientItemsRef)
       setCurrentClient(allClient);

       // localStorage.setItem("client", JSON.stringify(listOfClient)); 
    }
   

    function processTheText(input:string|undefined) {
        //map creating 
        let objectUnit:any = {
            "kg":"kg", "gm":"gm", "g":"gm", "k":"kg", "kilo":"kg", "gram":"gm"
        };
        if(!input) {return};
        let clientName = input.split("\n")[0];
        let ItemList = input.split("\n").slice(1,);

        if(ItemList.length == 0) {
            //it is client or not in the database
            if( !clientInDataBase(clientName)) {
                alert(clientName+" IS THE DATA add the client at top first")
            }else {
                alert("please provide the data below the client as well. Eg : quantity unit item-name")
            }
            return;
        }

        if(ItemList) {
            //format is quantity + unit + name - unit is optional
            //units are kg, gm , g , k , kilo, gram - quanity not provided then using the pkt for it.

           var value = ItemList.filter(words => {  
            if(words.trim() == "") {
                return true;
            }
            let letters = words.split(" ")
            let quantity = letters[0];
            
            let pattern = /[^\d.]+/;
            if(quantity.match(pattern)){
                //console.log(quantity);
                alert(quantity  + " wrong input -- provided in the text area | warning value @ "+ clientName )
                return true;
            }
           return false;
            });

            var returnValue = ItemList.map(words => {  
            if(words.trim() == "") {
                return true;
            }
            let letters = words.split(" ")
            let quantity = letters[0];

            let unit ;
            let item ;
            let category ;
            let room;

            if(letters[1] in objectUnit) {
                unit = objectUnit[letters[1]];
                item = letters.slice(2,).join(' ');
                category = "";
                room =  "";
            }else {
                unit = " pcs";
                item = letters.slice(1,).join(' ');
                category = "";
                room =  "";
            }
            

            let newObject:IlistItem = {name: item, quantity:quantity + " "+ unit, category:category, room:room};
           // console.log(newObject);
            //@ts-ignore
            //setItemArray(m => [...m, newObject])
           // console.log(quantity + " - " + unit +" " , "\n item name :" + item + " \nprice value : "+ category)
           return newObject;
            });


        //i.e not added value
        if(warningDivRef.current && value.length > 0) {
            warningDivRef.current.innerHTML += `<div><div>client : ${clientName}</div>  ${value.join("\n")}.</div><br/>`;
            //TODO adding the item DB check as well
        }
        return returnValue;
        }
    }

    function setTheCurrentTable(client:string) {
        //console.log(client);
        //console.log(currentClientItemsRef.current[client], currentClientItemsRef.current);
        var currentListItem = currentClientItemsRef.current[client];
        console.log(currentListItem, client)
        var dataToShow:IlistItem[] = currentListItem.map(m => {
            return {name:m.name, quantity:m.quantity, category:m.category, room:m.room }
        } )

        currentUserForPDF.current = client;
        
         setItemArray((m) => {
            return dataToShow})
    }
    function pdfAll() {
        var dataAll = currentClientItemsRef.current;
        // console.log(dataAll)
        currentAllValuePDF.current = dataAll;
        setDiffPDF(m=>!m);
    }
    function changeData() {
        setTallyTrue(!tallyTrue);
        // setDiffPDF(m=>!m);
    }

    return <div className="p-4">
    <div className='h-[85vh] flex justify-start gap-4'>
      <GenericCard>
        <h2 className="text-white text-2xl p-1">Item List</h2>
       
        <div className="  flex justify-between m-2 overflow-hidden h-[95%] gap-4">
            <div className="flex flex-col gap-2 w-1/2">
                {/* <ClientDesc name={clientListData.name} preferences={clientListData.preference} timing={clientListData.timing} address={clientListData.addPh} priority={clientListData.priority}></ClientDesc> */}
                <div className="text-white bg-blue-900 border rounded border-gray-700 py-2 px-1 w-full h-1/2 overflow-scroll justify-center flex flex-wrap gap-2">
                        {
                            currentClient ? currentClient.map(m => {
                                return <div onClick={function() {
                                    setTheCurrentTable(m);
                                }} className="p-4 rounded hover:bg-black hover:text-white cursor-pointer bg-white border text-blue-950 w-[45%] flex items-center justify-center ">{m}</div>
                            }) :""
                        }
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                <button onClick={function( ) {
                    setDiffPDF(()=> false);

                }} className="border rounded self-center bg-slate-600 py-1 px-2 text-white hover:bg-white hover:border hover:text-blue-950">Single Current PDF default</button>
                <button onClick={pdfAll} className="border rounded self-center bg-slate-600 py-1 px-2 text-white hover:bg-white hover:border hover:text-blue-950">Mulitple PDF</button>
                <button onClick={changeData} className="border rounded self-center bg-slate-600 py-1 px-2 text-white hover:bg-white hover:border hover:text-blue-950">Client Tally PDF</button>
                </div>
                {/* //#TODO  i.e adding the ability to correct the value and provide good name to each after
                // item database - having same name value */}
                <div ref={warningDivRef}  className="text-white border bg-blue-900 rounded border-gray-700 py-2 px-1 w-full h-[30%] overflow-scroll">

                </div>
            </div>
           <div className="w-1/2">
             <div className="w-[100%] h-[90%] border" >
                <textarea ref={textRef} placeholder="Provide the information eg : item quantity category" name="item" className="w-full resize-none focus:outline-none p-2 h-full">
                </textarea>
            </div>
            <div className="flex justify-center gap-4 mt-2">
            <button  onClick={updateTheItem} className="border px-4 py-2 bg-blue-950 text-white hover:bg-white hover:text-blue-700 rounded-md ">Update the item list</button>
            </div>
           </div>
        </div>
        
      </GenericCard>
      <GenericCard>
        <div className="h-[80vh] overflow-scroll border">
            <table className="table-auto border-collapse">
            <thead className="border-collapse border-slate-500 text-white ">
                <th >Item Name</th>
                <th >quantity</th>
                <th >Category</th>
                <th>Room No</th>
            </thead>
            {itemArray.map((m:IlistItem, index:number) => {
                return <ItemTable key={index} name={m.name} quantity={m.quantity} category={m.category} room={m.room}/>
            })}
           
        </table>
        </div>
      </GenericCard>
    </div>
    <GenericCard >  
        <div className="justify-end flex">
        <button className=" p-2 border border-blue-700 bg-blue-950 text-white">Download as PDF</button>
        <button className=" p-2 border border-blue-700 bg-blue-950 text-white">Download as CSV</button>
        </div>
        <div className="h-[80vh]">
            <div className="border m-4 border-white h-[100%]">
           {!diffPDF?  <PDFViewer width={"100%"} height={"100%"}>
                <MyItem client={currentUserForPDF} currentClient={clientListData} items={itemArray} totalPrice={totalRef}/>
            </PDFViewer> :  <PDFViewer width={"100%"} height={"100%"}>
                <MyItem2 items={currentAllValuePDF} tallyValue={tallyTrue} />
            </PDFViewer>}
            </div>
        </div>
    </GenericCard>
            {
                updateWrongClient ? <WrongModal currentClient={currentClient} currentClientItem={currentClientItemsRef} setCurrentClient={setCurrentClient} setWrongClient={setWrongClient} wrongClient={wrongClient}/>:""
            }
    </div>
}


function ItemTable({name, category, quantity, room}: {name:string, category:string, quantity:string, room:string}) {
    return <tbody>
        <td>{name}</td>
        <td>{quantity}</td>
        <td>{category}</td>
        <td>{room}</td>
    </tbody>
}

 function GenericCard({children}:{children:ReactNode| String}) {
    return <div className="flex-1 shadow-md rounded p-4 bg-blue-700 m-2">{children}</div>
} 