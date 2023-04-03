import Header from '../components/Header';
import Market from '../components/Market';
import Charts from '../components/Charts';
import TradeForm from '../components/TradeForm';
import Positions from '../components/Positions';
import Chatroom from '../components/Chatroom';
// import Counter from '../components/Counter';
import './../assets/css/views/home.css'

function Home() {
  return (
    <div>
      <Header />
      <div className='mui-content'>
        <div className='section mui-flex'>
          <Market />
          <Charts></Charts>
          <TradeForm></TradeForm>
        </div>
        <div className='section'>
          <Positions></Positions>
        </div>
      </div>
      
      <Chatroom></Chatroom>
      {/* <div className='section'>
        <Counter />
      </div> */}
    </div>
  );
}

export default Home;
