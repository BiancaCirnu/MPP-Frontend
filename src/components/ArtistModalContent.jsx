import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ArtistModalContent({ onArtistAdded, onCancel }) {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const artistData = {
      Name: name,
      Genre: genre,
      MonthlyListeners: monthlyListeners
    };
    
    axios.post("https://server-pearl-three-79.vercel.app:3001/createArtist", artistData)
      .then(result => {
        onArtistAdded(artistData);
      })
      .catch(error => {
        console.error("Error adding new artist:", error);
      });
  };
  
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            placeholder="Enter artist name" 
            className="form-control" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <input 
            type="text" 
            placeholder="Enter genre" 
            className="form-control" 
            required
            value={genre}
            onChange={(e) => setGenre(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Average monthly listeners</label>
          <input 
            type="text" 
            placeholder="Enter monthly listeners" 
            className="form-control" 
            required
            value={monthlyListeners}
            onChange={(e) => setMonthlyListeners(e.target.value)} 
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-success">Add Artist</button>
        </div>
      </form>
    </div>
  );
}
export default ArtistModalContent
