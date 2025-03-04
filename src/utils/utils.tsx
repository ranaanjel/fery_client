 export function findClient(setSearch:React.Dispatch<React.SetStateAction<string[] | []>>, clientInputRef:React.MutableRefObject<HTMLInputElement | null>) {
        var stringVal = (clientInputRef.current?.value)
        
        if(stringVal == "" ) {
            setSearch([])
            return;
        }

        var listOfClient = JSON.parse(localStorage.getItem("client") as string);
        // console.log(listOfClient)
        if(!listOfClient.data ) {
            return;
        }
        var mathingClient:string[] = (listOfClient.clientList).filter((m:string) => m.startsWith(stringVal as string));
        setSearch(mathingClient.slice(0,5));
    }

export function selectTheValue(event:any, clientInputRef:any,setSearchClient:any) {
        var client = (event.target.innerText);
        if(clientInputRef.current) {
        clientInputRef.current.value = client;
        setSearchClient([])
        }
}
export function inTheDB(name:string):boolean {
        let data =  JSON.parse(localStorage.getItem("client") as string).clientList;
        console.log(data, name, data.includes(name))
        return !data.includes(name);
    }
 export function clientInDataBase(name:string) {
        var clientValue = JSON.parse(localStorage.getItem("client") as string).clientList;
        return clientValue.includes(name);
    }

