// import path from "path";
// import { promises as fs } from "fs";

// export default async function handler(req, res) {
  
//   //Find the absolute path of the json directory
//   const jsonDirectory = path.join(process.cwd(), "json");
//   //Read the json data file data.json
//   const fileContents = await fs.readFile(jsonDirectory + "/oculusdata.json", "utf8");
//   //Return the content of the data file in json format
//   res.status(200).json(fileContents);
// }

import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  // Get the selected data value from the request query
  const selectedData = req.query.selectedData; // Make sure to use the correct query parameter name
  console.log("selectedData is " + selectedData);

  // Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "json");
  console.log("jsonDirectory is " + jsonDirectory);

  // Construct the path to the selected JSON file
  const jsonFilePath = path.join(jsonDirectory, `${selectedData}.json`);
  console.log("jsonFilePath is" + jsonFilePath);

  try {
    // Read the selected JSON data file
    const fileContents = await fs.readFile(jsonFilePath, "utf8");
    // Return the content of the data file in json format
    res.status(200).json(JSON.parse(fileContents));
  } catch (error) {
    console.error("Error reading JSON file:", error);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
}
