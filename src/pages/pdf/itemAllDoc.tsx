
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fefbfb',
    padding:"8px"
  },
  topLine: {
    borderTop : "8px #ff0000 solid",
    borderTopColor :"red",
    margin:"20px 0"
  },
  bottomLine: {
    borderBottom : "20px #00ff00 solid",
    borderBottomColor :"blue",
    margin:"5px auto",
    width:"97%"
  },
  section : {
    display:"flex",
    justifyContent:"center",
    flexDirection:"row",
    alignItems:"flex-end"
  },
  Header : {
    fontSize: "1.5rem",
    fontFamily:"Times-Bold"
  },
  logo:{
    backgroundColor:"blue",
    borderRadius: "0.2rem",
    padding:"4px 2px",
    color:"white",
    
  },
  addressText : {
    display:"flex",
    fontSize :"12px",
    border:"1px solid black",
    borderColor:"black",
    paddingLeft:"10px",
  },
  client :{
    fontFamily:"Times-Bold",
    marginLeft:"10px",
    color:"darkblue"
  }
  
});

const BusinessName = "Fery Delivery\n"
const logo = BusinessName[0];

// Create Document Component
export const MyItem2 = ({ items, tallyValue}: { items:any, tallyValue:boolean}) => {
    
    //console.log("hello world")
    const clientItem = Object.entries(items.current);
   // console.log(clientItem);

    return (
  <Document pageLayout='twoPageLeft' pageMode='fullScreen'>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.section}>
        <View style={{display:"flex", flexDirection:"row", gap:"2", alignItems:"flex-start"}}>
            <Text style={styles.logo}>{logo}
            </Text>
            <Text>
                <Text style={styles.Header}>{BusinessName}</Text>
            </Text>
        </View>
      </View>
     <View style={{marginLeft:"10px",fontSize:"16px"}}>
        <Text>All list :</Text>
     </View>
          {
        clientItem.length >0 ? clientItem.map(m => {
            return <View>
                <EachClient tally={tallyValue} client={m[0]} items={m[1]}/>
            </View>;
        }) : <View>
            <View style={{border:"1px solid lightgray", borderRadius:"0.2rem", padding:"16px", margin:"8px"}}>
        <TableRow tally={tallyValue} index='#' name='Item' quantity='Quantity' category='Category' room={`Room no`} style='bold'></TableRow>
      </View>
    
      <View style={styles.bottomLine}>
      </View>
        </View>
      }
    </Page>
  
  </Document>
)};

function EachClient({client,items, tally}:{client:string, items:any, tally:boolean}) {
    return <View wrap={false}>
        <View style={styles.client}>
        <Text> {client}</Text>
        </View>
        {!tally ? <UserInformation  name={client}/>:""}
        <View style={{border:"1px solid lightgray", borderRadius:"0.2rem", padding:"16px", margin:"8px"}}>
        <TableRow tally={tally} index='#' name='Item' quantity='Quantity' category='Category' room={`Room no`} style='bold'></TableRow>
       { items? items.map((m:any, index:number)=> {
            index++;
            return <TableRow tally={tally} index={String(index)} name={m.name} quantity={m.quantity} category={m.category} room={m.room} style="normal" /> } ):""
        }
      </View>
       { !tally?<View style={{width:"100%", display:"flex",flexDirection:"row",  justifyContent:"flex-end"}}><Text>{"complete"}  </Text> <Text> {"[ ]"} </Text></View>:""}
      <View style={styles.bottomLine}>
      </View>
    </View>
}

function TableRow({index,name, quantity, category, room, style, tally}:{index:string,name:string,quantity:string, category:string, room:string, style:"bold"| "normal", tally:boolean }) {
    
    let border = "";
    let fontV="";
    let bg = "";
    let fontS ;
    if(style == "bold") {
       border ="2px solid black";
       fontV="Helvetica-Bold"
       bg= "#f3e4cb"
       fontS = "12px";
    }else {
       border ="1px solid gray"
       fontV="Helvetica";
       bg = "#c9dff6"
        fontS = "8px"
    }

    return <View style={{fontWeight:style,fontFamily:fontV, display:"flex", flexDirection:"row", justifyContent:"flex-start", padding:"8px", fontSize:fontS, borderBottom:border, alignItems:"flex-start", backgroundColor:bg , textAlign:"left", }}>
        <View style={{width:"10%", textAlign:"left"}}><Text>{index}</Text></View>
        <View style={{width:"25%", textAlign:"left"}}><Text>{name}</Text></View>
        <View style={{width:"15%", textAlign:"left"}}><Text>{quantity}</Text></View>
        <View style={{width:"15%", textAlign:"right"}}><Text>{category}</Text></View>
       {!tally ?  <>
        <View style={{width:"10%", textAlign:"right"}}><Text>{room}</Text></View>
        <View style={{width:"10%", textAlign:"right"}}><Text>{style == "bold" ? "taken out" : "[ ]"}</Text></View>
        <View style={{width:"10%", textAlign:"right"}}><Text>{style=="bold"? "N.A" : '[ ]' }</Text></View>
        <View style={{width:"10%", textAlign:"right"}}><Text>{style=="bold"? "packed": "[ ]" }</Text></View>
       </>:""}
    </View>
}

function UserInformation({name}:{name:string}) {
  name = name.toLowerCase().trim();
  let data = JSON.parse(localStorage.getItem("client") as string);
  let clientIndex = data.clientList.findIndex((m:any) => name == m);
  //creating client id - hashing the value for future usage but for no using the index value for it
  let clientInfo = data.data[name];
  //console.log(clientInfo)

  //console.log(name)
  //console.log(clientIndex, data.data);

  return <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
    <Text>Client No : {clientIndex}</Text>
    <Text>Preference : {clientInfo.preference}</Text>
    <Text>Priority :{clientInfo.priority}</Text>
    <Text>Timing : {clientInfo.timing} </Text>
  </View>
}