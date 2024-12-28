import { useRef, useState } from "react";
import { clientInDataBase, findClient, selectTheValue } from "../utils/utils";
import { ClientModal } from "./clientModal";

export function WrongModal({setWrongClient, wrongClient,  currentClient,setCurrentClient, currentClientItem}:{setWrongClient:any, wrongClient:any, setCurrentClient:any, currentClientItem:any, currentClient:any}) {
    const [currentClientList, setCurrentClientList] = useState<string[]>([...wrongClient.current]);
    const [clientValueAdd,setClientValueAdd] = useState<string>(wrongClient.current[0]);
    
    //searching the values.
    const inputRef = useRef<HTMLInputElement |null>(null);
    const [clientList,setClientList] = useState<string[]>([])
    const [clientModal, setClientModal] = useState(false)

    //replacing in case of the currentClient and deleting and then adding in case of the item reference value.
    function replaceDeleteAdd() {
        //final confirm
    
        var wrongValue = clientValueAdd;
        var correctValue = inputRef.current?.value;
        if(correctValue == "") {
            return;
        }
        if(!clientInDataBase(correctValue as string) ) {
            alert('please only add the right value');
            return;
        }
        if(!confirm("are you sure to change this : \n\n new value : " + inputRef.current?.value + "\n old value : " + clientValueAdd)) {
           return; 
        }

        console.log(wrongValue, correctValue)
        //getting the index values
        var indexOfWrongValue = currentClient.findIndex((m:any) => m== clientValueAdd);
        var listOfCurrentClient = currentClient;
        //get the current client items
        var itemListValue = currentClientItem.current[wrongValue];
        var listOfCurrentClientItems = currentClientItem.current;

        //replacing the current client to real name
        listOfCurrentClient[indexOfWrongValue] = correctValue;
        //deleting and adding the correct value and setting the ref as well.
        delete listOfCurrentClientItems[wrongValue];
        listOfCurrentClientItems[correctValue as string] = itemListValue;
        currentClientItem.current = listOfCurrentClientItems;

        setCurrentClient(listOfCurrentClient);
       // console.log(indexOfWrongValue, itemListValue)


       //deleting the current wrong client from the modal i.e state -- reference to from the itemlist page and the 
       //state currentClientList as well


       let newWrongClient = wrongClient.current;
       newWrongClient = newWrongClient.filter((m :any) => clientValueAdd != m);

       wrongClient.current = newWrongClient;
       setCurrentClientList(newWrongClient);
       setClientValueAdd(newWrongClient[0]);
         if(!inputRef.current) {
                        return;
        }
         inputRef.current.value = "";

    }
    function openClientModal( ) {
        setClientModal(!clientModal);
    }

    return <div className="shade absolute items-center justify-center flex h-[100vh] left-0 top-0 w-[100vw] bg-opacity-35 bg-gray-700 flex">
        <div className="h-3/4 w-3/4 bg-white rounded  p-4 border-gray-600 ">
        
            <div className="flex justify-end mb-2">
             <div onClick={function() {
                //console.log(wrongClient.current)
                if(wrongClient.current.length > 0 && wrongClient.current[0] !== "") {
                    alert("please add the value")
                    wrongClient.current = [];
                    setWrongClient((m:any) => !m)
                    
                }else {
                    setCurrentClientList([]);
                    wrongClient.current =[]
                setWrongClient((m:any) => !m);
                }

                
             }} className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer inline-block select-none">X
             </div>
            
           </div>
    <div className="flex gap-2 justify-between h-[90%]">
            <div className="flex flex-col bg-blue-500 p-2 border h-full overflow-scroll gap-2 w-1/4">
                {currentClientList.map(m => {
                    return <div onClick={(function() {
                        setClientValueAdd(m)
                    })} className="cursor-pointer p-2 rounded border w-full text-center">
                        {m}
                    </div>
                })}

             </div>
           <div className="flex-1 bg-blue-950 text-white p-4 rounded flex gap-8 flex-col" >
             <div className="text-xl font-serif">Find The Client In DB</div>
             <div className="flex flex-col gap-4">
             <div>Current Client : <span className="text-yellow-500"> {clientValueAdd }</span></div>
              <div className="flex justify-between gap-2 relative">
                <input ref={inputRef} type="text" placeholder="client name" id="name" className="flex-1 bg-black text-white rounded" onChange={function (e) {
                    findClient(setClientList, inputRef)
                }}/>
                <div className="absolute w-[65%] top-[100%] left-[0%]" >
                    {clientList.map((m,index) => {
                return <div key={index} onClick={function(e) {
                    selectTheValue(e, inputRef, setClientList);
                   
                    //filling other section of it as well from the localstorage.
                }} className="hover:bg-blue-200 hover:text-blue-950 cursor-pointer px-4 py-2 border bg-blue-800 text-white w-[100%]" > 
                  {m}
                </div>
            })}
                </div>
                <button onClick={replaceDeleteAdd} className="bg-black py-2 px-2">Change the name</button>
             </div>

             </div>
           </div>
           <div className="flex-1 bg-blue-950 text-white p-4 rounded flex gap-8 flex-col"> 
                <div className="text-xl">
                    Add The Client To DB
                </div>
                <div>
                    Step 1 : Add the new client in the DB by clicking the Add to DB <br/> 
                    Step 2 : Then Find in the DB and change the value;
                </div>
                <button onClick={openClientModal} className="bg-black text-white border px-4 py-2 hover:bg-white hover:text-blue-900">Add to DB</button>
           </div>
        </div>
        </div>
        {clientModal ? <ClientModal setClientModal={setClientModal}/> :""}
    </div>
} 