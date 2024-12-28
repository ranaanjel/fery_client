export function ConfirmModal({setConfirmModal, data, action, clearInput}:{setConfirmModal:any, data:any, action:React.MutableRefObject<"add"|"update"|"delete">, clearInput:() =>void} ) {

    function onConfirm() {
        let objectData =  JSON.parse(localStorage.getItem("client") as string);
        //doing nothing just updating the value.
        if( action.current == "add") {
            objectData.data[data.current.name] = Object.assign({}, data.current);
            objectData.clientList.push(data.current.name);
        }else if(action.current == "update") {

            objectData.data[data.current.name] = Object.assign({}, data.current);

        } else if (action.current == "delete") {
            delete objectData.data[data.current.name];
            var index = objectData.clientList.findIndex((m:string) => m == data.current.name);
           // console.log(index)
             objectData.clientList.splice(index,1);
        }
        //console.log(objectData)


        localStorage.setItem("client",JSON.stringify(objectData) );
        //console.log(objectData);
        clearInput();
        setConfirmModal(()=> false)
    }

    function onCancel() {
        setConfirmModal(()=> false)
    }

    return <div className="confirmModal flex justify-center items-center absolute h-screen w-screen bg-gray-500 bg-opacity-40" >
        <div className="min-h-3/5 w-1/4 bg-white rounded  p-4 border-gray-600 "  >
            <div className="my-3">
                {data ? Object.entries(data.current).map((m:any,index:number )=> {

                var name = m[0];
                var value = m[1];
                return  <div key={index}>
                    {name} : {value}
                </div>
            }) :""}
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={onConfirm} className="bg-blue-950 p-2 text-xl text-white rounded  hover:bg-gray-300 hover:text-blue-950 hover:shadow-md">confirm</button>
                <button onClick={onCancel} className="bg-blue-950 p-2 text-xl text-white rounded  hover:bg-gray-300 hover:text-blue-950 hover:shadow-md">cancel</button>
            </div>
        </div>
        
    </div>
}