import AutoComplete from "./components/AutoComplete";
import AutoComplete2 from "./components/version2/AutoComplete2";

function App() {

  return (
    <div className="flex flex-col items-center w-full h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Auto Search Functionality</h1>
      <div className="flex w-full max-w-6xl gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Version 1</h2>
          <AutoComplete />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Version 2</h2>
          <AutoComplete2 />
        </div>
      </div>
    </div>
  );
}

export default App;
