import { Link } from 'react-router-dom';
import './WithInstructions.css';
import UploadIcon from '../icons/upload-file.svg'
import { useNavigate } from "react-router-dom";

function WithInstructions() {
    const navigate = useNavigate();
    uploadedDoc = false;
    uploadedInstructions = false;
    
    function HandleStartValidation(){
        if(uploadedDoc && uploadedInstructions){
            navigate("/validating");
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


let uploadedDoc = false;
let uploadedInstructions = false;
const formData = new FormData();

function handleFileUpload(event){
    console.log(event.target.files[0]);
    formData.append('doc_file', event.target.files[0]);
    uploadedDoc = true;
    if(uploadedDoc && uploadedInstructions){
        document.getElementById('Start-Validating-Container').style.display = "flex";
    }
}

function handleInstructionsUpload(event){
    console.log(event.target.files[0]);
    formData.append('instructions_file', event.target.files[0]);
    uploadedInstructions = true;
    if(uploadedDoc && uploadedInstructions){
        document.getElementById('Start-Validating-Container').style.display = "flex";
    }
}

export default WithInstructions;

document.title = 'Jožo - Uploading';