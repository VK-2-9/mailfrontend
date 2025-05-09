import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [sub, setSub] = useState("");
  const [sendStatus, setSendStatus] = useState(false);
  const [emailList, setemailList] = useState([]);

  const handlemsg = (e) => {
    setMsg(e.target.value);
  };
  const handlesub = (e) => {
    setSub(e.target.value);
  };

  const send = () => {
    setSendStatus(true);
    axios
      .post("https://mailbackend-72rq.onrender.com/sendemail", {
        sub: sub,
        msg: msg,
        emailList: emailList,
      })
      .then((data) => {
        if (data.data === true) {
          alert("Mail sent successfully");
          setSendStatus(false);
        } else {
          alert("Unable to send mail");
          setSendStatus(false);
        }
      });
  };

  const handlefile = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => {
        return item.A;
      });
      setemailList(totalemail);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <div className=" text-yellow-400 text-2xl font-medium text-center px-5 py-3">
        <h1> Bulk Mail App</h1>
      </div>

      <div className=" flex flex-col items-center text-black py-3">
        <input
          value={sub}
          onChange={handlesub}
          required
          className="text-white w-[80%] my-5 rounded-md h-12 py-2 px-2 outline-none bg-[#484646]"
          type="text"
          placeholder="Subject..."
        ></input>
        <textarea
          value={msg}
          onChange={handlemsg}
          className="text-white w-[80%] h-32 py-2 px-2 outline-none rounded-md bg-[#484646] "
          placeholder="Message..."
        ></textarea>

        <div>
          <p className="text-center mt-5 font-medium text-xl text-yellow-200">
            Upload your file below ↓
          </p>
          <input
            required
            onChange={handlefile}
            type="file"
            className="border-4 border-dashed py-4 px-4 my-5 text-white"
          ></input>
        </div>
        <p className="text-white">
          Total emails in the file:{emailList.length}
        </p>
        <button
          onClick={send}
          className="sendbtn bg-gradient-to-r from-red-400 to-[#ff0303] font-medium px-4 py-2 mt-2 text-white rounded-md w-fit"
        >
          {sendStatus ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
