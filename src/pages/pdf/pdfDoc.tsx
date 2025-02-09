import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import watermark from "../../assets/unpaid_mark.png"
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fefbfb',
    padding:"8px"
  },
  topLine: {
    borderTop : "8px #ff0000 solid",
    borderTopColor :"blue",
    margin:"20px 0"
  },
  bottomLine: {
    borderBottom : "20px #ff0000 solid",
    borderBottomColor :"blue",
    margin:"10px auto",
    width:"97%"
  },
  section : {
    display:"flex",
    justifyContent:"space-between",
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
  deliverySection : {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    border:"1px blue solid",
    borderColor:"blue",
    borderRadius:"0.2rem",
    padding:"10px",
    backgroundColor:"#f1e1c5",
    margin:"10px",
    position:"relative",
    backgroundImage: "linear-gradient(to right, red , yellow)",
    overflow:"hidden",
  }
});
console.log(watermark)

const BusinessName = `Quikcrats service pvt ltd`;
const Address = `\nNihal vihal \n`;
const logo = BusinessName[0];
const date = (new Date()).toString().split(" ").slice(0,4).join(" ");

let paid = false;

// Create Document Component


export const MyDocument = ({currentClient, totalPrice, items}: {currentClient:any, totalPrice:React.MutableRefObject<number>, items:any}) => (
  <Document pageLayout='twoPageLeft' pageMode='fullScreen'>
    <Page size="A4" style={styles.page}>
      <View style={styles.topLine}>
      </View>
      <View style={styles.section}>
        <View style={{display:"flex", flexDirection:"row", gap:"2", alignItems:"flex-start"}}>
            <Text style={styles.logo}>{logo}
            </Text>
            <Text>
                <Text style={styles.Header}>{BusinessName}</Text>
                <Text style={styles.addressText}>{Address}</Text>
            </Text>
        </View>
        <Text style={{fontSize:"12px", color:"#7e7e7e"}}> Invoice Date : {date}</Text>
      </View>
      {/* ----------- */}
      <View style={styles.deliverySection}>
        <View style={{fontSize:"0.8rem", fontFamily:"Helvetica-Bold", display:"flex", flexDirection:"column", width:"250px"}}>
            <Text>
                Bill and Ship To :
            </Text> 
            <View style={{fontFamily:"Helvetica", padding:"6px"}}>
             <Text style={{fontSize:"0.7rem", fontFamily:"Helvetica"}} >{currentClient.name ? currentClient.name +", ":"--\n"} </Text>
             <Text  style={{fontSize:"0.7rem", fontFamily:"Helvetica"}}>{currentClient.addPh ? currentClient.addPh +"\n":"--\n    "}</Text>
            </View>
        </View>
        <View style={{fontSize:"0.8rem", display:'flex', flexDirection:"column", alignItems:"flex-end"}}>
            
            <Text style={{fontFamily:"Helvetica", textTransform:"capitalize", fontSize:"0.8rem", color:"#4e4e4e"}}>Total Amount : <br/> <Text style={{color:"red", fontSize:"1.2rem"}}>{totalPrice.current ? totalPrice.current:"0"}</Text></Text>
            <Text style={{fontFamily:"Times-Bold",fontWeight:"extrabold"}}>{paid ? " Invoice paid ":" Invoice unpaid "}</Text>
        </View>
        <View style={{position:"absolute", width:"150px", height:"150px", zIndex:"1", top:"0", right:"100px"}}>
        <Image src={watermark} style={{position:"relative"}}></Image>
        </View>
        
      </View>
      {/* ------------- */}
      <View style={{border:"1px solid lightgray", borderRadius:"0.2rem", padding:"16px", margin:"8px"}}>
        <TableRow index='#' name='Item' quantity='Quantity' unitPr='Price/Unit' totalPr={`Total `+"Rs"} style='bold'></TableRow>
       { items? items.map((m:any, index:number)=> {
            index++;
            return <TableRow index={String(index)} name={m.name} quantity={m.quantity} unitPr={m.price} totalPr={m.total} style="normal" /> } ):""}
        

           <View style={{flexDirection:'row', display:"flex", justifyContent:"flex-end"}}>
            <View style={{fontSize:"0.8rem", display:'flex', flexDirection:"column", alignItems:"flex-end"}}>
            
            <Text style={{fontFamily:"Helvetica", textTransform:"capitalize", fontSize:"0.8rem", color:"#4e4e4e"}}>Total Amount : {"\n"} <Text style={{color:"red", fontSize:"1.2rem"}}>{totalPrice.current}</Text></Text>
            <Text style={{fontFamily:"Times-Bold",fontWeight:"extrabold"}}>{paid ? " Invoice paid ":" Invoice unpaid "}</Text>
        </View>
        </View>
      </View>
      <View style={styles.bottomLine}>
      </View>
    </Page>
  </Document>
);

function TableRow({index,name, quantity, unitPr, totalPr, style}:{index:string,name:string,quantity:string, unitPr:string, totalPr:string, style:"bold"| "normal" }) {
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
        <View style={{width:"40%", textAlign:"left"}}><Text>{name}</Text></View>
        <View style={{width:"15%", textAlign:"left"}}><Text>{quantity}</Text></View>
        <View style={{width:"15%", textAlign:"right"}}><Text>{unitPr}</Text></View>
        <View style={{width:"20%", textAlign:"right"}}><Text>{totalPr}</Text></View>
    </View>
}

export function DownloadLink({clientInput}:{clientInput:any}) {
  if(!clientInput.current) {
    return ;
  }


  function createDate() {
        let date ;
        let month = String(Number((new Date()).getMonth()) + 1);
        let year = String(Number((new Date()).getFullYear()) );
        let day = String(Number((new Date()).getDate()) );
        date = day+"-"+month+"-"+year;
        let pdfDate = clientInput.current?.value + "_" + date +".pdf";
         return pdfDate;
     }

  function gettingURL() {
    const iframe = document.querySelector("iframe")?.src;
    return iframe;
  }
  
  
  return <button ><a className=" p-[0.7rem] border border-blue-700 bg-blue-950 text-white" download={createDate()} href={gettingURL()} onClick={function () {
            console.log("downloaded")
        }}>Download as PDF</a></button>
}
