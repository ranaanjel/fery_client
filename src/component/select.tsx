interface IClientdata {
    name:string;
    addPh:string;
    preference:string;
    priority:string;
    timing:string;
}

export function SelectElem({reference, currentData, setClientListData}:{reference:any, currentData:string, setClientListData?:any}) {

    

    function changeValue(e:any) {
           let changeData = (e.target.value);
           let stateChanging = (e.target.parentElement?.parentElement.innerText.toLowerCase()).split(" ");
        
           if(currentData == "") {
            alert("please select the client")
            return;
           }
           
           stateChanging = stateChanging[0]
           stateChanging= (stateChanging?.replace(/\n|:/g," ")).split(" ")[0].trim();

          //console.log(stateChanging)
           if(!setClientListData) {
            return
           }

           //@ts-ignore
          setClientListData( (m) => {
            let newObj = Object.assign({}, m);
            if(stateChanging == "preference") {
                newObj.preference = changeData;
            }else {
                newObj.priority = changeData;
            }
            
             var listOfClient = JSON.parse(localStorage.getItem("client") as string);
            if(!listOfClient.data ) {
                return;
                }
            listOfClient.data[newObj.name] = newObj;
            localStorage.setItem("client", JSON.stringify(listOfClient));
            //console.log(listOfClient, localStorage)
            return {name:m.name, addPh:m.addPh, priority:newObj.priority, preference:newObj.preference, timing:newObj.timing} as IClientdata ;
          })
           
            
    }

    return <div> {currentData !="default" && currentData != "" ? currentData  : "" } 
        <select required onChange={changeValue} name="cars" id="cars" ref={reference} className="bg-slate-800 text-white px-2 py-1 cursor-pointer hover:bg-white hover:text-blue-700 rounded-sm">
            <option selected disabled value="select the option to change">change</option>
    <option value="High">High</option>
    <option value="Mid">Mid</option>
    <option value="Low">Low</option>
  </select>
    </div>
}
export function FunctionTiming({timeRefInput, meridanRefSelect,timing}:{timeRefInput:any, meridanRefSelect:any,timing?:string | undefined}) {
    if(!timing) {
        timing= ""
    }
    return  <div className="flex gap-2"> 
        <input placeholder={"change time "+timing } ref={timeRefInput} className="cursor-text focus:outline-none px-2 py-1 bg-slate-800 w-[80%] text-white" type="text" />
        <select ref={meridanRefSelect} name="timing" className="bg-slate-800 text-white px-2 py-1 hover:bg-white hover:text-blue-700 rounded">
        <option value="PM">PM</option>
        <option selected value="AM">AM</option>
    </select>
    </div>
    
}