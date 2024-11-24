import './ChatSection.css';
import SendIcon from '../icons/send-message.svg';
import UserIcon from '../icons/user_prompt.svg';
import AiIcon from '../icons/ai_output.svg';
import LoadingIcon from '../icons/loading_ai_prompt.gif';

function ChatSection() {
  return (
    <div className="Chat-Section-Container">
      <header className="Chat-Header">
        <div id='Chat-History'>
            <div className='User-Prompt'>
                <div className='Text-Bubble'>Check my file...</div>
                <img width="35px" height="35px" src={UserIcon}/>
            </div>
            <div className='Ai-Output'>
                <img width="35px" height="35px" src={AiIcon}/>
                <div className='Text-Bubble'>You don't need to do that..d asd asd ad asd sa sad as e.</div>
            </div>
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

function sendPrompt(){  
  const elem = document.getElementById('Text-Promt');
  console.log(elem.value);
  if(elem.value.length < 3 || awaitingResponse){
    return;
  }
  const chathistory  = document.getElementById('Chat-History');
  chathistory.innerHTML += "<div class=\"User-Prompt\"><div class=\"Text-Bubble\">"+ elem.value + "</div><img width=\"35px\" height=\"35px\" src="+ UserIcon + "/></div>";
  chathistory.innerHTML += "<img width='60px' height='27px' id='temp_img' src=" + LoadingIcon + ">";
  chathistory.scrollTo({ top: chathistory.scrollHeight, behavior: 'smooth' });
  document.getElementById('SendButton').style.display = 'none';
  awaitingResponse = true;
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

export default ChatSection;