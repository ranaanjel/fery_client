import React from 'react';
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
    margin:"10px auto",
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
  
});

const BusinessName = "Fery Delivery\n"
const logo = BusinessName[0];

// Create Document Component
export const MyItem = ({client, currentClient, totalPrice, items}: {client:React.MutableRefObject<string>,currentClient:any, totalPrice:React.MutableRefObject<number>, items:any}) => (
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
     
      
      <View style={{border:"1px solid lightgray", borderRadius:"0.2rem", padding:"16px", margin:"8px"}}>
        <Text>{client.current}</Text>
        <TableRow index='#' name='Item' quantity='Quantity' category='Category' place={`Room no`} style='bold'></TableRow>
       { items? items.map((m:any, index:number)=> {
            index++;
            return <TableRow index={String(index)} name={m.name} quantity={m.quantity} category={m.price} place={m.total} style="normal" /> } ):""}
      </View>
      <View style={{width:"100%", display:"flex",flexDirection:"row",  justifyContent:"flex-end"}}><Text>{"complete"}  </Text> <Text> {"[ ]"} </Text></View>
      <View style={styles.bottomLine}>
      </View>
    </Page>
  </Document>
);

function TableRow({index,name, quantity, category, place, style}:{index:string,name:string,quantity:string, category:string, place:string, style:"bold"| "normal" }) {
    
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
        <View style={{width:"10%", textAlign:"right"}}><Text>{place}</Text></View>
        <View style={{width:"10%", textAlign:"right"}}><Text>{style == "bold" ? "Taken out" : "[ ]"}</Text></View>
        <View style={{width:"10%", textAlign:"right"}}><Text>{style=="bold"? "N.A" : '[ ]' }</Text></View>
        <View style={{width:"10%", textAlign:"right"}}><Text>{style=="bold"? "Packed": "[ ]" }</Text></View>
    </View>
}