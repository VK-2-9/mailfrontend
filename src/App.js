import { useState } from "react";
import axios from "axios"
import * as XLSX from "xlsx"

function App() {
  const [msg, setMsg] = useState("");
  const[sendStatus,setSendStatus]=useState(false)
  const [emailList,setemailList]=useState([])

  const handlemsg = (e) => {
    setMsg(e.target.value);
  };

  const send=()=>{
    setSendStatus(true)
      axios.post("https://mailbackend-72rq.onrender.com/sendemail",{msg:msg,emailList:emailList}).then((data)=>{
        if (data.data === true){
          alert("Mail sent successfully")
          setSendStatus(false)
        }
        else {
          alert("Unable to send mail")
        setSendStatus(false)
        }
      })
  }

  const handlefile=(e)=>{
    const file=e.target.files[0]
  

    const reader=new FileReader();
    reader.onload=function(e){
        const data=e.target.result;
        const workbook=XLSX.read(data,{type:"binary"})
        const sheetName=workbook.SheetNames[0]
        const worksheet=workbook.Sheets[sheetName] 
        const emailList=XLSX.utils.sheet_to_json(worksheet,{header:"A"})
        const totalemail=emailList.map((item)=>{
          return item.A
        })
        setemailList(totalemail)
              
    }
   reader.readAsBinaryString(file);
  }

  return (
    <div>
      <div className="bg-blue-950 text-white text-2xl font-medium text-center px-5 py-3">
        <h1> Bulk Mail</h1>
      </div>

      <div className="bg-blue-800 text-white  font-medium text-center px-5 py-3">
        <p> We can help your business with sending multiple emails at once</p>
      </div>

      <div className="bg-blue-600 text-white  font-medium text-center px-5 py-3">
        <p>Drag and Drop</p>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black py-3">
        <textarea
          value={msg} onChange={handlemsg}
          className="w-[80%] h-32 py-2 px-2 outline-none border border-black rounded-md"
          placeholder="Enter your mail subject here....."
        ></textarea>

        <div>
          <input
           onChange={handlefile}
            type="file"
            className="border-4 border-dashed py-4 px-4 my-5"
          ></input>
        </div>
        <p>Total emails in the file:{emailList.length}</p>
        <button onClick={send} className="bg-blue-950 font-medium px-4 py-2 mt-2 text-white rounded-md w-fit">
          
          {  sendStatus?"Sending...":"Send"}
          
        </button>
      </div>

      <div className="bg-blue-300  p-8"></div>

      <div className="bg-blue-200  p-8"></div>
    </div>
  );
}

export default App;
