import { useRef, useState } from "react"
import { FunctionTiming, SelectElem } from "./select";
import { findClient, selectTheValue, inTheDB } from "../utils/utils";
import { ClientData } from "../pages/client";
import { ConfirmModal } from "./confirmModal";

export function ClientModal({modelRef, setClientModal} : {modelRef?: React.MutableRefObject<HTMLDivElement|null>, setClientModal:any, originalInput?:React.MutableRefObject<HTMLInputElement|null>}) {

    const priRef = useRef<HTMLSelectElement | null>(null);
    const prefRef = useRef<HTMLSelectElement | null>(null);
    const clientInputRef = useRef<HTMLInputElement| null>(null);
    const phoneInputRef = useRef<HTMLInputElement| null>(null);
    const addTextRef = useRef<HTMLTextAreaElement| null>(null);
    const modalSelectRef = useRef<HTMLSelectElement | null>(null);
    const modalTimeRef = useRef<HTMLInputElement| null>(null);
    const [clientList, setClientList] = useState< string[] | [] >([])
    const [openConfirm, setOpenConfirm] = useState(false);
    const currentValue = useRef<object>({})
    const actionRef = useRef<"add" | "update" | "delete">("add");


    function validate(numberClient:string) {
        console.log("validating the data")
        // can be multiple using the `,` for split and each number is 10digit and option +91
        var allPhone = numberClient.split(",");
        var pattern = /^\d{10}$/;
        // console.log(allPhone, allPhone[0].match(pattern))
        return allPhone.every(m => m.match(pattern));
    }

    
    function fillOtherValue() {
        let data =  JSON.parse(localStorage.getItem("client") as string).data;
        let name = clientInputRef.current?.value as string;

        if(addTextRef.current) {
            addTextRef.current.value = data[name].addPh;
        }
        if(phoneInputRef.current)
        {
            if(data[name].phoneNumber) {
                phoneInputRef.current.value = data[name]
            }else {
                console.log("no number is there")
            } 
        }
        if (priRef.current) {
            let value = data[name].priority.split("");
            value[0] = value[0].toUpperCase();
            priRef.current.value = value.join("") ;
        }

        if (prefRef.current) {
            let value = data[name].preference.split("")
             value[0] = value[0].toUpperCase();
            prefRef.current.value = value.join("");
        }
        if(modalTimeRef.current) {
            modalTimeRef.current.value = data[name].timing;
        }
        
    }

    function addTheDataToLocalStorage() {
        let currentName = clientInputRef.current?.value.trim() as string;
        const address = addTextRef.current?.value as string;
        const phoneNumber = phoneInputRef.current?.value as string;
        const priority = priRef.current?.value.includes("change") ? "Mid": priRef.current?.value ;
        const preference = prefRef.current?.value.includes("change")?"Mid": prefRef.current?.value;
        const timing = !modalTimeRef.current?.value ? "8-10": modalTimeRef.current?.value;
        const AMPM = modalSelectRef.current?.value;
        const addPh = address + "\n" + phoneNumber ;
        console.log(address, priority, preference, timing, AMPM)
        const time = timing + " " + AMPM;

        if(inTheDB(currentName)) {
            let inputValid = validate(phoneNumber as string);
            if(!inputValid) {
                alert("invalid input number -- add the number")
                return;
            }
            //finally adding the value
            
            let newObject = new ClientData(currentName, addPh, preference, priority,time, phoneNumber);
        //console.log(newObject)

            if(currentValue) {
                currentValue.current = newObject;
                actionRef.current = "add";
                setOpenConfirm(m => !m)
            }
        }else {
            alert("please provide new client name")
            return;
        }

        console.log("adding");
    }
    function deleteDataToLocalStorage() {
        
        let currentName = clientInputRef.current?.value.trim() as string;
        if(!inTheDB(currentName)) {

        actionRef.current = "delete";


        let newObject = new ClientData(currentName,addTextRef.current?.value as string, );
        currentValue.current = newObject;

        setOpenConfirm(m => !m)
        //console.log("deleting")

        }else {
            alert("no such user")
            return
        }
        //requires name;

    }
    function updateTheDataToLocalStorage() {

        const address = addTextRef.current?.value as string;
        const phoneNumber = phoneInputRef.current?.value as string;

        if(phoneNumber != "") {
            if(!validate(phoneNumber)){
                alert("valid data to phone number")
                return;
            };
        }   

        const priority = priRef.current?.value.includes("change") ? "Mid": priRef.current?.value ;
        const preference = prefRef.current?.value.includes("change")?"Mid": prefRef.current?.value;
        const timing = !modalTimeRef.current?.value ? "8-10": modalTimeRef.current?.value;
        const AMPM = modalSelectRef.current?.value;
        const addPh = address + "\n" + phoneNumber ;
        console.log(address, priority, preference, timing, AMPM)
        const time = timing + " " + AMPM;

        let currentName = clientInputRef.current?.value.trim() as string;
        if(!inTheDB(currentName)) {

        actionRef.current = "update";
        

        let newObject = new ClientData(currentName,addPh, preference, priority, time, phoneNumber);
        currentValue.current = newObject;

        setOpenConfirm(m=> !m)

        }else {
            alert("no such user")
            return;
        }
    }

    function cleanInput() {
        if(clientInputRef.current) clientInputRef.current.value = "";
        if(addTextRef.current) addTextRef.current.value = "";
        if(phoneInputRef.current) phoneInputRef.current.value =""

    }


    const closeMark = useRef<HTMLInputElement | null>(null);
    function closeTheModal(e:any) {
        const className = Array.from(e.target.classList)

        if(className.includes("shade")) {
            //@ts-ignore
            setClientModal(m => !m)
        }

    }

    return <div onClick={closeTheModal} ref={modelRef} className="shade absolute items-center justify-center flex h-[100vh] left-0 top-0 w-[100vw] bg-opacity-35 bg-gray-700">
        <div className="min-h-3/4 w-1/2 bg-white rounded  p-4 border-gray-600"  >
           <div className="flex justify-end mb-2">
             <div onClick={function() {
                setClientModal((m:any) => !m);
             }} ref={closeMark} className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer inline-block select-none">X</div>
           </div>
           <div className="flex flex-col justify-center items-center border rounded p-4 gap-2">
            <div className="flex flex-row w-[70%] items-center relative">
                <label htmlFor="name" className="w-[25%]"> Client &nbsp; </label>
                <input ref={clientInputRef} type="text" placeholder="client name" id="name" className="flex-1 bg-blue-950 text-white rounded" onChange={function () {
                    findClient(setClientList, clientInputRef)
                }}/>
                <div className="absolute w-[50%] top-[100%] left-[25%]" >
                    {clientList.map((m,index) => {
                return <div key={index} onClick={function(e) {
                    selectTheValue(e, clientInputRef, setClientList);
                    //filling other section of it as well from the localstorage.
                    fillOtherValue();
                }} className="hover:bg-blue-200 hover:text-blue-950 cursor-pointer px-4 py-2 border bg-blue-800 text-white w-[100%]" > 
                  {m}
                </div>
            })}
                </div>
            </div>
            <div className="flex flex-row w-[70%] items-start">
                <label htmlFor="name" className="w-[25%]"> Address &nbsp; </label>
                <textarea ref={addTextRef}  placeholder="address" className="h-56 p-2 flex-1 bg-blue-950 resize-none rounded text-white" ></textarea>
            </div>
            <div className="flex flex-row w-[70%] items-center">
                <label htmlFor="name" className="w-[25%]"> Phone no &nbsp; </label>
                <input ref={phoneInputRef} type="text" placeholder="eg : +918785490344" className="flex-1 bg-blue-950 text-white"/>
            </div>
            <div className="flex flex-row w-[70%] items-center">
                <label htmlFor="name" className="w-[25%]"> Priority &nbsp; </label>
                <SelectElem reference={priRef} currentData="default" />
            </div>
            <div className="flex flex-row w-[70%] items-align">
                <label htmlFor="name" className="w-[25%]"> Preference &nbsp; </label>
                <SelectElem reference={prefRef} currentData="default" />
            </div>
            <div className="flex flex-row w-[70%] items-align">
                <label htmlFor="name" className="w-[25%]"> Timing &nbsp; </label>
                <FunctionTiming timeRefInput={modalTimeRef} meridanRefSelect={modalSelectRef} />
            </div>
           </div>
           <div className="flex gap-2 border items-center justify-center p-4">
            <button onClick={addTheDataToLocalStorage} className="bg-blue-950 p-4 text-xl text-white rounded hover:bg-gray-300 hover:text-blue-950 hover:shadow-md ">
                Add Data
           </button>
           <button onClickCapture={updateTheDataToLocalStorage} className="bg-blue-950 p-4 text-xl text-white rounded  hover:bg-gray-300 hover:text-blue-950 hover:shadow-md">Update Data</button>
           
           <button onClick={deleteDataToLocalStorage} className="bg-blue-950 p-4 text-xl text-white rounded  hover:bg-gray-300 hover:text-blue-950 hover:shadow-md">Delete Data</button>
           </div>
        </div>

        {openConfirm ? <ConfirmModal clearInput={cleanInput} action={actionRef} data={currentValue}  setConfirmModal={setOpenConfirm}/> : ""}
    </div>

}
