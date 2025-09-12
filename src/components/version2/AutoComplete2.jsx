import SearchBox from "./searchBox";
import ListBox from "./listBox";
const maxItems = 10;
export default function AutoComplete2() {
  const transformData = (data) => data.slice(0, maxItems);
  const dataPromise = async (query, signal) =>
    await fetch(
      "https://en.wikipedia.org/w/api.php" +
        `?action=query&list=search&format=json&utf8=&srlimit=10` +
        `&origin=*` +
        `&srsearch=${encodeURIComponent(query)}`,
      { signal }
    );
  return (
    <div className="w-full max-w-md">
      <SearchBox
        id="personName"
        name="personName"
        label="Enter Person Name"
        placeholder="Search Wikipedia..."
        autoComplete
        styles={{
          input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        }}
        debounceWait={400}
        listBox={(items, activeIndex) => (
          <ListBox items={items} activeIndex={activeIndex} />
        )}
        noItemMessage={() => <div className="text-sm text-gray-500 p-2">Sorry no results found</div>}
        errorMessage={() => <div className="text-sm text-red-600 p-2">Something went wrong</div>}
        transformData={transformData}
        promise={dataPromise}
      />
    </div>
  );
}
