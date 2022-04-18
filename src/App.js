import './App.css';
import Home from './pages/home/home';
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
          <script src="https://cdn.pubnub.com/pubnub.min.js" async="true"></script>
          <script src="https://cdn.pubnub.com/webrtc/webrtc-v2.js" async="true"></script>
      </Helmet>
      <Home />
    </>
  );
}

export default App;
