import './PredefinedInstructions.css';
import UploadIcon from '../icons/upload-file.svg';
import { getData } from '../api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { postDocData } from "../api/api";
import AiIcon from '../icons/ai_output.svg';
import {threadIDGet, getInstID} from '../components/ChatSection';

function PredefinedInstructions() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getData("/instructions").then(response => {
        setData(response.instructions);
      }
    )
  }, []);

  const navigate = useNavigate();
    function HandleStartValidation(){
        if(fileUploaded && instructionChosen){
            formDataDoc.append('instruction_id', instructionId);
            getInstID(instructionId);
            postDocData("/assistant", formDataDoc).then(response => {
                threadIDGet(response.thread_id);
                if(response.response[0] === '`'){
                  document.getElementById('Chat-History').innerHTML += "<div class='Ai-Output'><img width=\"35px\" height=\"35px\" src="+ AiIcon + "/><div class='Text-Bubble'>" + response.response.substring(8, response.response.length - 3) + "</div></div>"
                }
                else{
                  document.getElementById('Chat-History').innerHTML += "<div class='Ai-Output'><img width=\"35px\" height=\"35px\" src="+ AiIcon + "/><div class='Text-Bubble'>" + response.response + "</div></div>"
                }
                document.getElementById('temp_img').remove();
            });
            navigate("/validating");
        }
        else{ 
            alert('Please upload both files before proceeding.'); 
        }
    }

  return (
    <div className="PredefinedInstructions">
    <header className="PredefinedI-header">
        <div className='UploadArea'>
            <h1 className='Upload-Label'>Document File</h1>
            <img alt="upload_icon" className="Upload-Icon" width="50px" height="50px" src={UploadIcon} />
            <input className="UploadSize" type='file' onChange={handleFileUpload}/>
        </div>
        <div className='Instructions-List-Container'>
          <div className='Instructions-Title'>Available Instructions</div>
            {data.map((instruction) => (
              <div onClick={clickedInstruction} className='Instruction-Choice' key={instruction._id} id={instruction._id}>{instruction.name}</div>
            ))}
        </div>
        <div id='Start-Validating-Container'>
          <button onClick={HandleStartValidation} className='Validation-Choice bg-green'>Start Validating</button>
        </div>

    </header>
  </div>
  );
}

export default PredefinedInstructions;

let fileUploaded = false;
let instructionChosen = false;
const formDataDoc = new FormData();

function handleFileUpload(event){
  formDataDoc.append('file', event.target.files[0]);
  formDataDoc.append('name', event.target.files[0].name);
  fileUploaded = true;
  if(fileUploaded && instructionChosen){
    document.getElementById('Start-Validating-Container').style.display = "flex";
  }
}

var lastElemClicked = null;
let instructionId = 0;
function clickedInstruction(event){
  if(lastElemClicked != null){
    lastElemClicked.classList.remove('Picked-Instruction');
    lastElemClicked = event.target;
  }
  else{
    lastElemClicked = event.target;
  }
  instructionId = event.target.id;
  event.target.classList.add('Picked-Instruction');
  instructionChosen = true;
  if(fileUploaded && instructionChosen){
    document.getElementById('Start-Validating-Container').style.display = "flex";
  }
}

function HandleStartValidation(event){
  
}

document.title = 'docMaster - Uploading';