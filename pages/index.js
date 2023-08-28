//useSWR allows the use of SWR inside function components
import { useState } from 'react';
import useSWR from "swr";
import '.pages/index.css'; // Import your custom CSS file for styling

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  //Sorting state and logic
  const [sortBy, setSortBy] = useState('None'); // Default sorting by price

  //Filterting state and logic
  const [selectedSource, setSelectedSource] = useState('All'); // Default: show all items

  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR("/api/staticdata", fetcher);
  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  
  const filteredData = selectedSource === 'All'
    ? data
    : data.filter(item => item.source === selectedSource);

  let combinedData = [...filteredData]

  // Combine sorting and filtering effects.. /[$,]/g
  if (sortBy === 'lowToHigh') {
    combinedData.sort((a, b) => parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, '')));
  } else if (sortBy === 'highToLow') {
    combinedData.sort((a, b) => parseFloat(b.price.replace(/[$,]/g, '')) - parseFloat(a.price.replace(/[$,]/g, '')));
  }

  return (
    <div>
      <h1>Search results for <q>oculus quest 2 128gb</q>...</h1>
      <div>
        <label>Sort by price:</label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="none">None</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>
      <div>
        <label>Filter by source:</label>
        <select onChange={(e) => setSelectedSource(e.target.value)}>
          <option value="All">All</option>
          <option value="eBay">eBay</option>
          <option value="Facebook Marketplace">Facebook Marketplace</option>
          <option value="Remix Market">Remix Market</option>
        </select>
      </div>
      <ul>
        {combinedData.map((item, index) => (
          <li key={index}>
            <h2>{item.title}</h2>
            <img src={item.image_url} alt={item.title} />
            <p>Price: {item.price}</p>
            <p>Shipping: {item.delivery}</p>
            <p>Returns: {item.returns}</p>
            <p>Source: {item.source}</p>
            <a className="listing-link" href={item.listing_url}>View Listing</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
