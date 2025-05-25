import React, { useState, useEffect } from 'react';
import axios from 'axios';


function VenueModalContent({ onVenueAdded, onCancel }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const venueData = {
      Name: name,
      Address: address,
      City: city,
      Country: country
    };
    
    axios.post(import.meta.env.VITE_SERVER_URL+"createVenue", venueData)
      .then(result => {
        onVenueAdded(venueData);
      })
      .catch(error => {
        console.error("Error adding new venue:", error);
      });
  };
  
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            placeholder="Enter location name" 
            className="form-control" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input 
            type="text" 
            placeholder="Enter address" 
            className="form-control" 
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input 
            type="text" 
            placeholder="Enter city" 
            className="form-control" 
            required
            value={city}
            onChange={(e) => setCity(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input 
            type="text" 
            placeholder="Enter country" 
            className="form-control" 
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)} 
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-success">Add Venue</button>
        </div>
      </form>
    </div>
  );
}

export default VenueModalContent
