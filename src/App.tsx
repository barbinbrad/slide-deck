import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import {
  FullScreenVideo,
  Slides,
  Slide,
  SteakCode,
  TemperatureGraph,
} from "./components";

function App() {
  return (
    <ChakraProvider>
      <Slides>
        <Slide>
          <h1>Steak</h1>
          <img className="small" src="/assets/beef.png" alt="steak" />
        </Slide>

        {/* Currently not working */}
        {/* <Slide>
          <Spotlight />
        </Slide> */}

        <Slide>
          <SteakCode config={1} />
        </Slide>

        <Slide type="video">
          <FullScreenVideo src="/assets/fire.mp4" />
          <h1>Heat</h1>
        </Slide>

        <Slide>
          <TemperatureGraph />
        </Slide>

        <Slide type="black">
          <h1>Methods</h1>
          <img src="/assets/sous-vide.jpeg" alt="sous vide" />
        </Slide>

        <Slide>
          <h1>Sear</h1>
          <img className="small" src="/assets/sear.jpg" alt="searing steak" />
        </Slide>

        <Slide type="black">
          <h1>Sous Vide</h1>
          <img className="small" src="/assets/sous-vide.png" alt="sous vide" />
        </Slide>

        <Slide type="white">
          <h1>Bake</h1>
          <img className="small" src="/assets/oven.jpg" alt="oven" />
        </Slide>

        <Slide>
          <SteakCode config={2} />
        </Slide>

        <Slide type="video">
          <FullScreenVideo src="/assets/fire.mp4" />
          <h1>Finish</h1>
        </Slide>

        <Slide type="black">
          <img
            className="large"
            src="/assets/unfinished.jpg"
            alt="unfinished steak"
          />
        </Slide>

        <Slide type="black">
          <img
            className="large"
            src="/assets/methods.jpg"
            alt="comparison of methods"
          />
        </Slide>
      </Slides>
    </ChakraProvider>
  );
}

export default App;
