import { useState, useEffect, useRef } from 'react';
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {

  const [sortBy, setSortBy] = useState('None'); 
  const [selectedSource, setSelectedSource] = useState('All'); 
  const [selectedData, setSelectedData] = useState('none');
  const [selectedDelivery, setSelectedDelivery] = useState('All');
  const contentRef = useRef(null);

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
        <style>
        {`
          /* Style for the image select container */
          .image-select {
            display: flex;
            flex-wrap: wrap; /* Wrap images to the next row */
            justify-content: center; /* Center the images horizontally */
            gap: 20px; /* Adjust the gap between images */
          }
      
          /* Style for each clickable image */
          .image-select img {
            width: 400px; /* Adjust the width of each image as needed */
            height: auto;
            cursor: pointer; /* Change the cursor to a pointer on hover */
          }

          /* Style for the search bar */
          body {
            background: #f5f5f5; /* Light grey background */
            font-family: 'Open Sans', sans-serif;
          }

          .search {
            width: 100%;
            position: relative;
            display: flex;
          }

          .searchTerm {
            width: 100%;
            border: 3px solid #777; /* Dark grey border */
            border-right: none;
            padding: 5px;
            height: 50px;
            border-radius: 30px 0 0 30px;
            outline: none;
            color: #777; /* Dark grey text color */
            font-size: 15px;
          }

          .searchTerm:focus {
            color: #000; /* Black text color when focused */
          }

          .searchButton {
            width: 50px;
            height: 50px;
            border: 1px solid #777; /* Dark grey border */
            background: #777; /* Dark grey background */
            text-align: center;
            color: #fff; /* White text color */
            border-radius: 0 30px 30px 0;
            cursor: pointer;
            font-size: 15px;
          }

          /* Resize the wrap to see the search bar change! */
          .wrap {
            width: 60%;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}
        </style>

        <h1>fbmp gold</h1>
        <h1><center>shop the best of facebook marketplace in nyc</center></h1>
        <br></br>
        <br></br>

        {/* <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" id="item" name="item" placeholder="Search 'bertoia chair' or 'paper lamp'"></input>
            <button className="searchButton" onClick={(e) => {
              setSelectedData('sept22_bertoiachair');
              setTimeout(() => {
                contentRef.current.scrollIntoView({ behavior: 'smooth' });
              }, "500");
            }}>Go</button>
          </div>
        </div> */}
        
        <div><h2><center>click a pic to shop</center></h2>
          <div className="image-select">
            <div>
              <p>bertoia chairs</p>
              <img
                src="https://i.pinimg.com/736x/a7/d6/aa/a7d6aa7c88b074b8a5e16035c88f896a.jpg"
                alt="Image 1"
                onClick={() => {
                  setSelectedData('sept22_bertoiachair');
                  setTimeout(() => {
                    contentRef.current.scrollIntoView({ behavior: 'smooth' });
                  }, "500");
                }}
              />
            </div>
            <div>
              <p>acrylic tables + lamps</p>
              <img              
                src="https://i.pinimg.com/736x/f7/06/f6/f706f6bbc14c5b441a67b9344af08aa8.jpg"
                alt="Image 2"
                onClick={() => {
                  setSelectedData('sept23_sidetablelamp');
                  setTimeout(() => {
                    contentRef.current.scrollIntoView({ behavior: 'smooth' });
                  }, "500");
                }}
              />
            </div>
          </div>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div ref={contentRef} id="startScrollToThisContent" ></div>
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
            width: 500px;
            height: 500px;
            overflow: hidden;
            align-items: center; /* Vertically center-align the button */
            position: relative;
            display: flex;
            justify-content: center;
          }

          .photo-container img {
            width: 100%; /* Adjust the width as needed */
            height: auto; /* Maintain aspect ratio */
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
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
          }

          .next-button:hover {
            background-color: dark grey; /* Change to your desired hover background color */
          }

          /* Style for the image select container */
          .image-select {
            display: flex;
            flex-wrap: wrap; /* Wrap images to the next row */
            justify-content: center; /* Center the images horizontally */
            gap: 20px; /* Adjust the gap between images */
          }
      
          /* Style for each clickable image */
          .image-select img {
            width: 400px; /* Adjust the width of each image as needed */
            height: auto;
            cursor: pointer; /* Change the cursor to a pointer on hover */
          }

          /* Style for the search bar */
          body {
            background: #f5f5f5; /* Light grey background */
            font-family: 'Open Sans', sans-serif;
          }

          .search {
            width: 100%;
            position: relative;
            display: flex;
          }

          .searchTerm {
            width: 100%;
            border: 3px solid #777; /* Dark grey border */
            border-right: none;
            padding: 5px;
            height: 50px;
            border-radius: 30px 0 0 30px;
            outline: none;
            color: #777; /* Dark grey text color */
            font-size: 15px;
          }

          .searchTerm:focus {
            color: #000; /* Black text color when focused */
          }

          .searchButton {
            width: 50px;
            height: 50px;
            border: 1px solid #777; /* Dark grey border */
            background: #777; /* Dark grey background */
            text-align: center;
            color: #fff; /* White text color */
            border-radius: 0 30px 30px 0;
            cursor: pointer;
            font-size: 15px;
          }

          /* Resize the wrap to see the search bar change! */
          .wrap {
            width: 60%;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .item-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr); /* Two columns with equal width */
            gap: 20px; /* Adjust the gap between items as needed */
          }
          
        `}
        </style>

        <h1>fbmp gold</h1>
        <h1><center>shop the best of facebook marketplace in nyc</center></h1>
        <br></br>
        <br></br>

        {/* <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" id="item" name="item" placeholder="Search 'bertoia chair' or 'paper lamp'"></input>
            <button className="searchButton" onClick={(e) => {
              setSelectedData('sept22_bertoiachair');
              setTimeout(() => {
                contentRef.current.scrollIntoView({ behavior: 'smooth' });
              }, "500");
            }}>Go</button>
          </div>
        </div> */}
        
        <div><h2><center>click a pic to shop</center></h2>
          <div className="image-select">
            <div>
              <p>bertoia chairs</p>
              <img
                src="https://i.pinimg.com/736x/a7/d6/aa/a7d6aa7c88b074b8a5e16035c88f896a.jpg"
                alt="Image 1"
                onClick={() => {
                  setSelectedData('sept22_bertoiachair');
                  setTimeout(() => {
                    contentRef.current.scrollIntoView({ behavior: 'smooth' });
                  }, "500");
                }}
              />
            </div>
            <div>
              <p>acrylic tables + lamps</p>
              <img              
                src="https://i.pinimg.com/736x/f7/06/f6/f706f6bbc14c5b441a67b9344af08aa8.jpg"
                alt="Image 2"
                onClick={() => {
                  setSelectedData('sept23_sidetablelamp');
                  setTimeout(() => {
                    contentRef.current.scrollIntoView({ behavior: 'smooth' });
                  }, "500");
                }}
              />
            </div>
          </div>
        </div>

        <br></br>
        <br></br>
        <div ref={contentRef} id="scrollToThisContent">
        <h2>Search Results</h2>
        </div>
        <p>All results shown are within 40 miles of nyc.</p>
        <div>
        {/* <label>Sort by price:</label>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="none">None</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select> */}
      {/* <div>
        <label>Filter by source:</label>
          <select onChange={(e) => setSelectedSource(e.target.value)}>
            <option value="All">All</option>
            <option value="eBay">eBay</option>
            <option value="Facebook Marketplace">Facebook Marketplace</option>
          </select>
      </div>
      <div>
        <label>Filter by delivery method:</label>
          <select onChange={(e) => setSelectedDelivery(e.target.value)}>
            <option value="All">All</option>
            <option value="p">Liz delivers to you! Maybe even for free if you ask nicely!</option>
            <option value="Free local pick up from Brooklyn, NY">Pickup in Brooklyn, NY</option>
            <option value="Free local pick up from New York, NY">Pickup in New York, NY</option>
            <option value="Free local pick up from Jersey City, NJ">Pickup in Jersey City, NJ</option>
            <option value="Free local pick up from Ridgewood, NY">Pickup in Ridgewood, NY</option>
            <option value="Free local pick up from Long Island City, NY">Pickup in Long Island City, NY</option>
            <option value="Free local pick up from Highland Park, NJ">Pickup in Highland Park, NJ</option>
            <option value="Free local pick up from Fair Lawn, NJ">Pickup in Fair Lawn, NJ</option>
            <option value="Free local pick up from Astoria, NY">Pickup in Astoria, NY</option>
            <option value="Free local pick up from Forest Hills, NY">Pickup in Forest Hills, NY</option>
            <option value="Free local pick up from Inwood, NY">Pickup in Inwood, NY</option>
            <option value="Free local pick up from West Nyack, NY">Pickup in West Nyack, NY</option>
            <option value="Free local pick up from Union City, NJ">Pickup in Union City, NJ</option>
            <option value="Shipping">Shipping</option>
          </select>
      </div> */}
      <ul>
        <div className="item-container">
        {combinedData.map((item, index) => (
          <li key={index} className="item">
            <h3>{item.title}</h3>
            <div className="photo-container">
              <img
                src={item[`photo_url${item.photo_index}`]}
                alt={`Photo ${item.photo_index}`}
              />
              {item[`photo_url${item.photo_index + 1}`] && (
              <button className="next-button" onClick={() => handleNextPhoto(index)}>&rarr;</button>
              )}
            </div>
            <p>Price: {item.price}</p>
            <p>Deliver Method: {item.delivery}</p>
            {/* <p>Returns: {item.returns}</p> */}
            <p>Source: {item.source}</p>
            <a className="listing-link" href={item.listing_url} target="_blank" rel="noopener noreferrer">View Listing</a>
          </li>
        ))}
        </div>
      </ul>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}