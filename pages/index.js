//useSWR allows the use of SWR inside function components
import { filter } from "selenium-webdriver/lib/promise";
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR("/api/staticdata", fetcher);
  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  
  //Adding filter feature
  const [selectedSource, setSelectedSource] = useState('All'); // Default: show all items
  const filteredData = selectedSource === 'All'
    ? data
    : data.filter(item => item.source === selectedSource);

  return (
    <div>
      <h1>Search results</h1>
      <div>
        <label>Filter by source:</label>
        <select onChange={(e) => setSelectedSource(e.target.value)}>
          <option value="All">All</option>
          <option value="eBay">eBay</option>
          <option value="Facebook Marketplace">eBay</option>
          <option value="Remix Market">eBay</option>
        </select>
      </div>
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            <h2>{item.title}</h2>
            <img src={item.image_url} alt={item.title} />
            <p>Price: {item.price}</p>
            <p>Shipping: {item.shipping}</p>
            <p>Returns: {item.returns}</p>
            <a href={item.listing_url}>View Listing</a>
            <p>Source: {item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
