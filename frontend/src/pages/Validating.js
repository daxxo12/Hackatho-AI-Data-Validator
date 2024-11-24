import './Validating.css';
import ChatSection from '../components/ChatSection';
import UploadIcon from '../icons/upload-file.svg'


function Validating() {
  return (
    <div className="Validating">
    <header className="Validating-header">
      <div className='Validating-Content'>
          <div className='UploadArea'>
            <h1 className='Upload-Label'>Document File To Re-Validate</h1>
            <img className="Upload-Icon" width="50px" height="50px" src={UploadIcon} />
            <input className="UploadSize" type='file'/>
        </div>
        <ChatSection />
      </div>
    </header>
  </div>
  );
}

export default Validating;



document.title = 'Jožo - Validating';