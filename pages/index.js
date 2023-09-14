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
  const [scrollToContent, setScrollToContent] = useState(false);


  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR(
    selectedData !== 'none' ? `/api/staticdata?selectedData=${selectedData}` : null,
    fetcher
  );

  useEffect(() => {
    console.log("useEffect triggered")
    if (scrollToContent && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToContent]);
    

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
            width: 500px; /* Adjust the width of each image as needed */
            height: auto;
            cursor: pointer; /* Change the cursor to a pointer on hover */
          }
        `}
        </style>

        <h1>Relish</h1>
        <h1><center>A used furniture and home decor feed curated for you.</center></h1>
        <p><center>Relish learns your interior design style then searches furniture resale sites to find unique, affordable pieces you&#39;ll love.</center></p>
        <br></br>
        <br></br>
        <h3>Click on an image to shop second hand and vintage furniture in that style.</h3>
        <div className="image-select">
          <img
            src="https://pbs.twimg.com/media/F53x9reWcAAPZUO?format=jpg&name=large"
            alt="Image 1"
            onClick={() => {
              setSelectedData('sept11_noguchi');
              setScrollToContent(true);
            }}
          />
          <img              
            src="https://pbs.twimg.com/media/F51aW7DWwAAsVIk?format=jpg&name=large"
            alt="Image 2"
            onClick={() => {
              setSelectedData('sept11_spaceagechair');
              setScrollToContent(true);
            }}
          />
        </div>
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

        /* Style for the image select container */
        .image-select {
          display: flex;
          flex-wrap: wrap; /* Wrap images to the next row */
          justify-content: center; /* Center the images horizontally */
          gap: 20px; /* Adjust the gap between images */
        }
    
        /* Style for each clickable image */
        .image-select img {
          width: 500px; /* Adjust the width of each image as needed */
          height: auto;
          cursor: pointer; /* Change the cursor to a pointer on hover */
        }
    
      `}
      </style>
      <h1>Relish</h1>
        <h1><center>A used furniture and home decor feed curated for you.</center></h1>
        <p><center>Relish learns your interior design style then searches furniture resale sites to find unique, affordable pieces you&#39;ll love.</center></p>
        <br></br>
        <br></br>
        <h3>Click on an image to shop second hand and vintage furniture in that style.</h3>
        <div className="image-select">
          <img
            src="https://pbs.twimg.com/media/F53x9reWcAAPZUO?format=jpg&name=large"
            alt="Image 1"
            onClick={() => {
              setSelectedData('sept11_noguchi');
              setScrollToContent(true);
            }}
          />
          <img              
            src="https://pbs.twimg.com/media/F51aW7DWwAAsVIk?format=jpg&name=large"
            alt="Image 2"
            onClick={() => {
              setSelectedData('sept11_spaceagechair');
              setScrollToContent(true);
            }}
          />
        </div>
        <br></br>
        <br></br>
        <div ref={contentRef} id="scrollToThisContent">
        <h3>Here are secondhand and vintage pieces featured in that photo.</h3>
        </div>
        <p>All results shown are within 50 miles of NYC and listed in the last 7 days.</p>
        <div>
        {/* <label>Sort by price:</label>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="none">None</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select> */}
      <div>
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
            <option value="Shipping">Shipping</option>
          </select>
      </div>
      <ul>
        {combinedData.map((item, index) => (
          <li key={index}>
            <h3>{item.title}</h3>
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
