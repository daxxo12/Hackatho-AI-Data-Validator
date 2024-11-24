import { Link } from 'react-router-dom';
import './WithInstructions.css';
import UploadIcon from '../icons/upload-file.svg'
import { useNavigate } from "react-router-dom";
import { postData, postDocData } from "../api/api";
import AiIcon from '../icons/ai_output.svg';
import Markdown from 'react-markdown';
import {threadIDGet, getInstID} from '../components/ChatSection';

function WithInstructions() {
    const navigate = useNavigate();
    uploadedDoc = false;
    uploadedInstructions = false;
    
    function HandleStartValidation(){
        if(uploadedDoc && uploadedInstructions){
            postData("/instructions", formDataIns).then(id => {
                formDataDoc.append('instruction_id', id);
                getInstID(id);
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
            })
        }
        else{ 
            alert('Please upload both files before proceeding.'); 
        }
    }
  return (
    <div className="WithInstructions">
    <header className="WithI-header">
        <div className='UploadArea'>
            <h1 className='Upload-Label'>Document File</h1>
            <img className="Upload-Icon" width="50px" height="50px" src={UploadIcon} />
            <input className="UploadSize" type='file' onChange={handleFileUpload}/>
        </div>
        <div className='UploadArea'>
            <h1 className='Upload-Label'>Instructions File</h1>
            <img className="Upload-Icon" width="50px" height="50px" src={UploadIcon} />
            <input className="UploadSize" type='file' onChange={handleInstructionsUpload}/>
        </div>
    </header>
    <div id='Start-Validating-Container'>
        <button onClick={HandleStartValidation} className='Validation-Choice bg-green'>Start Validating</button>
    </div>
  </div>
  );
}

function asdfq(response){
    return <Markdown>response.response</Markdown>;    
}

let uploadedDoc = false;
let uploadedInstructions = false;
const formDataDoc = new FormData();
const formDataIns = new FormData();

function handleFileUpload(event){
    formDataDoc.append('file', event.target.files[0]);
    formDataDoc.append('name', event.target.files[0].name);
    uploadedDoc = true;
    if(uploadedDoc && uploadedInstructions){
        document.getElementById('Start-Validating-Container').style.display = "flex";
    }
}

function handleInstructionsUpload(event){
    formDataIns.append('file', event.target.files[0]);
    formDataIns.append('name', event.target.files[0].name);
    uploadedInstructions = true;
    if(uploadedDoc && uploadedInstructions){
        document.getElementById('Start-Validating-Container').style.display = "flex";
    }
}

export default WithInstructions;

document.title = 'docMaster - Uploading';