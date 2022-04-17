import './App.css';
import Home from './pages/home/home';
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
          <script src="https://cdn.pubnub.com/pubnub.js" async="true"></script>
          <script src="https://stephenlb.github.io/webrtc-sdk/js/webrtc.js" async="true"></script>
      </Helmet>
      <Home />
    </>
  );
}

export default App;
