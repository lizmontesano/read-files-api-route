//useSWR allows the use of SWR inside function components
import { useState } from 'react';
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {

  //Selecting data, sorting by price, filtering by source
  const [sortBy, setSortBy] = useState('None'); // Default sorting by price
  const [selectedSource, setSelectedSource] = useState('All'); // Default: show all items
  const [selectedData, setSelectedData] = useState('none'); // Default: use data1.json
  const [selectedDelivery, setSelectedDelivery] = useState('All'); // Default: all

  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR(
    selectedData !== 'none' ? `/api/staticdata?selectedData=${selectedData}` : null,
    fetcher
  );
  //Handle the error state
  if (error) return <div>Failed to load</div>;
  // Check if data is not available yet or if no data source is selected
  if (!data || selectedData === 'none') {
    return (
      <div>
        <h1>What are you looking for?</h1>
        <div>
          <label>Search for:</label>
          <select onChange={(e) => setSelectedData(e.target.value)}>
            <option value="none">Select</option>
            <option value="sept6_noguchi">Noguchi Paper Lamp</option>
            <option value="sept6_spaceagechair">Space Age Chair</option>
            <option value="sept7_movingsale">~Moving Sales~</option>
          </select>
        </div>
        <h3>The results shown are located within 50 miles of NYC and were posted in the last 7 days.</h3>
        <h3>If you make a purchase, then I will coordinate NYC deliveries and quality checks!</h3>
      </div>
    );
  }
  
  //Filter and sort functionality
  //const filteredData = selectedSource === 'All'
  //  ? data
  //  : data.filter(item => item.source === selectedSource);
  const filteredData = data
  .filter(item => selectedSource === 'All' || item.source === selectedSource)
  .filter(item => selectedDelivery === 'All' || item.delivery.includes(selectedDelivery));

  let combinedData = [...filteredData]

  if (sortBy === 'lowToHigh') {
    combinedData.sort((a, b) => parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, '')));
  } else if (sortBy === 'highToLow') {
    combinedData.sort((a, b) => parseFloat(b.price.replace(/[$,]/g, '')) - parseFloat(a.price.replace(/[$,]/g, '')));
  }

  function handleNextPhoto(index) {
    // Assuming combinedData is your array of listings
    const listing = combinedData[index];

    // Increment the photo index
    listing.photo_index = (listing.photo_index + 1) % listing.num_photos;

    // Find the image element within the list item and update the src attribute
    const listItem = document.querySelectorAll('li')[index];
    const imageElement = listItem.querySelector('img');
    imageElement.src = listing[`photo_url${listing.photo_index}`];

    // You might also want to update the alt attribute of the image
    imageElement.alt = `Photo ${listing.photo_index + 1}`;

    // Update any other elements you want to change, such as the photo index display
    // For example, you can update the displayed index: "Photo X of Y"
    //const photoIndexDisplay = listItem.querySelector('.photo-index-display');
    //photoIndexDisplay.textContent = `Photo ${listing.photo_index + 1} of ${listing.num_photos}`;
  }

  return (    
    <div>
      <style>
      {`
        .listing-link {
          color: blue;
          text-decoration: underline;
        }

        /* Style for the photo container */
        .photo-container {
          display: flex;
          align-items: center; /* Vertically center-align the button */
        }

        /* Style for the right arrow button */
        .next-button {
          background-color: grey; /* Change to your desired background color */
          color: #fff; /* Change to your desired text color */
          border: none;
          border-radius: 50%;
          width: 60px; /* Adjust the width and height as needed */
          height: 60px;
          font-size: 24px; /* Adjust the font size as needed */
          cursor: pointer;
          margin-left: -30px; /* Add some space between the image and button */
        }

        .next-button:hover {
          background-color: dark grey; /* Change to your desired hover background color */
        }

        .photo-container img {
          width: 35%; /* Adjust the width as needed */
          height: auto;
        }
   
      `}
      </style>
      <h1>What are you looking for?</h1>
      <div>
        <label>Search for:</label>
        <select onChange={(e) => setSelectedData(e.target.value)}>
          <option value="none">Select</option>
          <option value="sept6_noguchi">Noguchi Paper Lamp</option>
          <option value="sept6_spaceagechair">Space Age Chair</option>
          <option value="sept7_movingsale">~Moving Sales~</option>
        </select>
      </div>
      <h3>The results shown are located within 50 miles of NYC and were posted in the last 7 days.</h3>
      <h3>If you make a purchase, then I will coordinate NYC deliveries and quality checks!</h3>
      <div>
        <h3>Results:</h3>
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
          </select>
      </div>
      <ul>
        {combinedData.map((item, index) => (
          <li key={index}>
            <h2>{item.title}</h2>
            <div className="photo-container">
              <img
                src={item[`photo_url${item.photo_index}`]}
                alt={`Photo ${item.photo_index}`}
                style={{ width: '35%', height: 'auto' }} // Adjust the width as needed
              />
              {item[`photo_url${item.photo_index + 1}`] && (
              <button className="next-button" onClick={() => handleNextPhoto(index)}>&rarr;</button>
              )}
            </div>
            <p>Price: {item.price}</p>
            <p>Shipping: {item.delivery}</p>
            <p>Returns: {item.returns}</p>
            <p>Source: {item.source}</p>
            <a className="listing-link" href={item.listing_url} target="_blank" rel="noopener noreferrer">View Listing</a>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
