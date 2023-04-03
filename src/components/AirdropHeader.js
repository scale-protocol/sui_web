// import { Link } from 'react-router-dom';
import './../assets/css/components/header.css'

function AirdropHeader() {
  return (
    <div className="mui-header">
      <div className="section mui-fl-vert mui-fl-btw">
        <div className="mui-fl-vert">
        {/* <Link to="/"> */}
          <p className="logo"></p>
        {/* </Link> */}
        </div>
      </div>
    </div>
  );
}

export default AirdropHeader;
