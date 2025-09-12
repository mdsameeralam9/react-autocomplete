import AutoComplete from "./components/AutoComplete";
import AutoComplete2 from "./components/version2/AutoComplete2";

function App() {

  return (
    <div className="flex flex-col items-center w-full h-screen">
      <h1>Auto Search Functionality</h1>
      <AutoComplete />
      <AutoComplete2 />
    </div>
  );
}

export default App;
