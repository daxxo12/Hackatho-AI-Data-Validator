import './ChatSection.css';
import SendIcon from '../icons/send-message.svg';
import UserIcon from '../icons/user_prompt.svg';
import AiIcon from '../icons/ai_output.svg';
import LoadingIcon from '../icons/loading_ai_prompt.gif';
import { postDocData, userPromptData } from '../api/api';


const marked = require('marked');
let thread_id = "";
function ChatSection() {
  return (
    <div className="Chat-Section-Container">
      <header className="Chat-Header">
        <div id='Chat-History'>
            <div className='User-Prompt'>
                <div className='Text-Bubble'>Check my file...</div>
                <img width="35px" height="35px" src={UserIcon}/>
            </div>
            <img width='60px' height='27px' id='temp_img' src={LoadingIcon} />
        </div>
        <div className='Input-Area'>
          <textarea id="Text-Promt" onChange={handleInputTyping} placeholder="Type something..." className="Chat-Input" type='text'/>
          <img onMouseDown={sendPrompt} alt='send_button' id="SendButton" src={SendIcon}/>
        </div>
      </header>
    </div>
  );
}

let awaitingResponse = false;
export const threadIDGet = (threadID) => { 
  thread_id = threadID;
}
let instructionID = "";
export const getInstID = (instrID) => { 
  instructionID = instrID;
}

function sendPrompt(){  
  const elem = document.getElementById('Text-Promt');
  if(elem.value.length < 3 || awaitingResponse){
    return;
  }
  const chathistory  = document.getElementById('Chat-History');
  chathistory.innerHTML += "<div class=\"User-Prompt\"><div class=\"Text-Bubble\">"+ elem.value + "</div><img width=\"35px\" height=\"35px\" src="+ UserIcon + "/></div>";
  chathistory.innerHTML += "<img width='60px' height='27px' id='temp_img' src=" + LoadingIcon + ">";
  chathistory.scrollTo({ top: chathistory.scrollHeight, behavior: 'smooth' });
  document.getElementById('SendButton').style.display = 'none';
  awaitingResponse = true;
  const userForm = new FormData();
  userForm.append("id_thread", thread_id);
  userForm.append("message", elem.value)
  userPromptData("/chat", userForm).then(response => {
    if(response.data.message[0] === '`'){
      document.getElementById('Chat-History').innerHTML += "<div class='Ai-Output'><img width=\"35px\" height=\"35px\" src="+ AiIcon + "/><div class='Text-Bubble'>" + response.data.message.substring(8, response.data.message.length - 3) + "</div></div>"
    }
    else{
      document.getElementById('Chat-History').innerHTML += "<div class='Ai-Output'><img width=\"35px\" height=\"35px\" src="+ AiIcon + "/><div class='Text-Bubble'>" + response.data.message + "</div></div>"
    }
    document.getElementById('temp_img').remove();
    chathistory.scrollTo({ top: chathistory.scrollHeight, behavior: 'smooth' });
    awaitingResponse = false;
  });
  elem.value = '';
}

function handleInputTyping(event){
  const value = event.target.value;
  if(value === ''){
    document.getElementById('SendButton').style.display = 'none';
  }
  else{
    document.getElementById('SendButton').style.display = 'block';
  }
}

export const handleFileReVal = (event) => { 
  const formDataDoc = new FormData();
  formDataDoc.append('file', event.target.files[0]);
  formDataDoc.append('instruction_id', instructionID);
  formDataDoc.append('thread_id', thread_id);
  document.getElementById('Chat-History').innerHTML += "<div class=\"User-Prompt\"><div class=\"Text-Bubble\">"+ "Revalidate my file" + "</div><img width=\"35px\" height=\"35px\" src="+ UserIcon + "/></div>";
  document.getElementById('Chat-History').innerHTML += "<img width='60px' height='27px' id='temp_img' src=" + LoadingIcon + ">";
  document.getElementById('Chat-History').scrollTo({ top: document.getElementById('Chat-History').scrollHeight, behavior: 'smooth' });
  postDocData("/assistant", formDataDoc).then(response => {
    if(response.response[0] === '`'){
      document.getElementById('Chat-History').innerHTML += "<div class='Ai-Output'><img width=\"35px\" height=\"35px\" src="+ AiIcon + "/><div class='Text-Bubble'>" + response.response.substring(8, response.response.length - 3) + "</div></div>"
    }
    else{
      document.getElementById('Chat-History').innerHTML += "<div class='Ai-Output'><img width=\"35px\" height=\"35px\" src="+ AiIcon + "/><div class='Text-Bubble'>" + response.response + "</div></div>"
    }
      document.getElementById('temp_img').remove();
      event.target.value = '';
  });

}

export default ChatSection;