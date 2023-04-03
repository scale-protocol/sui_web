import AirdropHeader from '../components/AirdropHeader';
import AirdropContent from '../components/AirdropContent';
import './../assets/css/views/airdrop.css'

function Airdrop() {
  return (
    <div>
      <AirdropHeader />
      <div className='mui-content'>
        <div className='section mui-fl-vert'>
            <AirdropContent />
        </div>
      </div>
    </div>
  );
}

export default Airdrop;
