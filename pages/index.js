//useSWR allows the use of SWR inside function components
import { useState } from 'react';
import useSWR from "swr";

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
  
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  const sortedData = [data].sort((a, b) => {
    if (sortBy === 'lowToHigh') {
      const priceA = parseFloat(a.price.replace(['$', ','], ''));
      const priceB = parseFloat(b.price.replace(['$', ','], ''));
      return priceA - priceB;
    } else if (sortBy === 'highToLow') {
      const priceA = parseFloat(a.price.replace(['$', ','], ''));
      const priceB = parseFloat(b.price.replace(['$', ','], ''));
      return priceB - priceA;
    }
    return 0; // No sorting
  });
  
  const filteredData = selectedSource === 'All'
    ? data
    : data.filter(item => item.source === selectedSource);

  return (
    <div>
      <h1>Search results for chrome chair</h1>
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
        {sortedData.map((item, index) => (
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
