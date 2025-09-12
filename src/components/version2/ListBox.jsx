const ListBox = ({ items, activeIndex }) => {
  return (
    <ul className="listBoxContainer">
      {items.map((item, index) => (
        <li
          className={`listBoxItem ${index === activeIndex ? "activeItem" : ""}`}
          key={index}
        >
          {
            <a
              key={item.pageid}
              className="data hover:underline"
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                item.title
              )}`}
              target="_blank"
              rel="noreferrer"
              title={item.snippet.replace(/<[^>]*>?/gm, "")}
            >
              {item.title}
            </a>
          }
        </li>
      ))}
    </ul>
  );
};

export default ListBox;
