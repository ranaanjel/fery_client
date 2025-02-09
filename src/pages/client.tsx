import { useRef, useState } from "react";
import { ClientModal } from "../component/clientModal";
import { findClient, selectTheValue } from "../utils/utils";


export function ClientList() {
    //updating the client list in the localstorage.
    let dataValue = "";
    let [clientModal, setClientModal] = useState(false);
    let [clientList, setClientList] = useState<string[]| []>([])
    
    const modelRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);


    if(!localStorage.getItem("client")){
        localStorage.setItem("client", '{"data":{}, "clientList":[]}');
    }
    let data = localStorage.getItem("client");

    // console.log(data)
    let clientlist = JSON.parse(data as string);
    

    let fileRef = useRef<HTMLInputElement | null>(null)
    let [uploaded, setUploaded] = useState(false);
    let [fileName, setFileName] = useState("")

  
     function getTheData() {
        if(fileRef.current?.files == null){
            return <div></div>;
        }   
        const currentFile = fileRef.current.files[0];
        const name = currentFile.name;
        setFileName(name);
        setUploaded(!uploaded);

        var reader = new FileReader();
        
        if(currentFile) {
            reader.onload = async function(e) {
                //console.log(e.target?.result)
                dataValue += e.target?.result;
            }
            reader.onloadend = function () {
                parseData()
            }

             reader.readAsText(currentFile)
        }

    }

    function parseData() {
        var pattern = dataValue.split("@").map(n => n.split("..")).slice(1,).map(m => m.slice(1,));
        pattern = pattern.map(m=> m.slice(0,5).map(m => m.replace(/(\n|,|")/g,"")));
        // name, address+ phone, preference and priority , timing - time is constant 8-10 default 
        //console.log(pattern);
        pattern.pop()
        pattern.forEach(m => {
            let value = JSON.parse(localStorage.getItem("client") as string);
            let name = m[0].trim();
            let address = m[1];
            let phone = m[2];//phone number
            let addPh = address + "\n"+ phone;
            let pref = m[3] || "mid";
            let pri = m[4] || "mid";
            let time =  "8-10 AM"
            let objValue = new ClientData(name,addPh, pref, pri, time,phone );
            // console.log(objValue)
         
            if(!value?.data[name]) {
                value.data[name] = objValue;
                value.clientList.push(name);
                localStorage.setItem("client", JSON.stringify(value));
            }else {
                alert(name+ " vendor is present already please do it via console.")
            }

        })

        window.location.reload();
    }

    function addTheClient() {
        //checking the localstorage for the given client
        setClientModal(!clientModal);
    }
    function downloadTheClient() {
        let data = JSON.parse(localStorage.getItem("client") as string);
        let objectValue : any[] = Object.values(data.data);

        let headers = String(objectValue.map((m:any) => Object.keys(m).join(","))[0]) + "\n";
        let rows = objectValue.map((m:any) => Object.values(m).map((m:any) => m.replace(/\n/g,"")).join(",")).join("\n");
        let csv = headers + rows;

        // console.log(rows, data.data)
        let anchorTag = document.createElement("a");
        let blob = new Blob([csv], {type:"text/csv"});
        let url = URL.createObjectURL(blob);
        anchorTag.href = url;
        anchorTag.download = "data.csv";
        document.body.append(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag);
    }

    return <div className="flex flex-col p-4">

        <div className="flex justify-center items-center gap-4">
            {!uploaded ?  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-[30%] h-32 border-2 border-gray-300 border-dashed rounded cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Only CSV file</p>
         </div>
            <input id="dropzone-file" type="file" className="hidden" ref={fileRef} /> 
            </label> : <div>
                {fileName} uploaded
                </div>}
            <div>
            <button title="Please upload only the csv file" className="hover:bg-white hover:text-blue-950 bg-blue-900 p-4 text-xl rounded text-white" onClick={getTheData}>Get The Data</button>
             </div>
            <div className="border-l border-gray-200 h-56 flex items-center p-6 gap-6 relative" >
                <input ref={inputRef} onChange={
                    function() {
                        findClient(setClientList,inputRef)
                    }
                } type="text" className="bg-blue-600 text-white texl-xl rounded focus:outline-none p-4" />

                <div className="absolute w-[50%] top-[62%]" >
                    {clientList.map((m,index) => {
                return <div key={index} onClick={function(e) {
                    selectTheValue(e, inputRef, setClientList)
                }} className="hover:bg-blue-200 hover:text-blue-950 cursor-pointer px-4 py-2 border bg-blue-800 text-white w-[100%]" > 
                  {m}
                </div>
            })}
                </div>
                
                <button onClick={addTheClient} className="bg-blue-900 text-white text-xl rounded p-4 hover:bg-white hover:text-blue-950">Add New Client</button>
            </div>
        </div>

        {clientModal ? <ClientModal originalInput={inputRef} modelRef={modelRef} setClientModal={setClientModal}/> : ""}
        
        <div className="mb-2 text-xl font-serif text-white">
            <button onClick={downloadTheClient} title="download the client data" className="ml-6 rounded-sm shadow-xl py-1 px-2 font-sans bg-blue-950 text-white hover:bg-white hover:shadow-lg hover:text-blue-950">
                Download CSV
            </button>
        </div>

        <div className="flex flex-wrap justify-center">
                    {/* {clientlist} */}
                    {Object.values(clientlist.data).map((m:any,index:number) => {
                        return <div key={index} className="text-sm p-4 text-white w-[24%] bg-blue-900 m-[0.5px]">
                            <div>name : <span className="text-yellow-500">{m.name}</span></div>
                            <div>address & phone : <span>{m.addPh}</span></div>
                            <div>preference : <span>{m.preference}</span></div>
                            <div>priority : <span>{m.priority}</span></div>
                            <div>timing : <span>{m.timing ? m.timing :""}</span></div>
                        </div>
                    })}
        </div>
        <div>

        </div>
   
   
    </div>

}



// interface clientType {
//     name:string,
//     addPh:string,
//     preference:string | "mid";
//     priority:string;
//     timing:string;
//     phoneNo:string,
// }

export class ClientData  {
    constructor(public name:string,public addPh:string, public preference?:string|"mid", public priority?:string|"mid", public timing?:string, public phoneNo?:string) {
    }
}