const ListBox = ({ items, activeIndex }) => {
  return (
    <ul className="border border-gray-300 border-t-0 rounded-b-md bg-white shadow-lg max-h-60 overflow-y-auto">
      {items.map((item, index) => (
        <li
          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-900"
          key={index}
        >
          <a
            className="block hover:underline"
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              item.title
            )}`}
            target="_blank"
            rel="noreferrer"
            title={item.snippet?.replace(/<[^>]*>?/gm, "") || item.title}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ListBox;
