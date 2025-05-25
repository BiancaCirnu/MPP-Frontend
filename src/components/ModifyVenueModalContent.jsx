import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModifyVenueModalContent({ onCancel }) {
  const [venues, setVenues] = useState([]);
  const [editingVenue, setEditingVenue] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // Fetch all venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = () => {
    axios.get(process.env.SERVER_URL+"getVenues")
      .then(result => {
        setVenues(result.data);
      })
      .catch(error => {
        console.error("Error fetching venues:", error);
        alert("Failed to load venues. Please try again.");
      });
  };

  const handleEditClick = (venue) => {
    setEditingVenue(venue);
    setName(venue.Name || '');
    setAddress(venue.Address || '');
    setCity(venue.City || '');
    setCountry(venue.Country || '');
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
    setName('');
    setAddress('');
    setCity('');
    setCountry('');
  };

  const handleUpdateVenue = (e) => {
    e.preventDefault();
    
    const updatedVenue = {
      Name: name,
      Address: address,
      City: city,
      Country: country
    };

    axios.patch(process.env.SERVER_URL+`updateVenue/${editingVenue._id}`, updatedVenue)
      .then(result => {
        alert("Venue updated successfully!");
        fetchVenues();
        handleCancelEdit();
      })
      .catch(error => {
        console.error("Error updating venue:", error);
        alert("Failed to update venue. Please try again.");
      });
  };

  const handleDeleteVenue = (venueId) => {
    axios.delete(process.env.SERVER_URL+`deleteVenue/${venueId}`)
      .then(result => {
        fetchVenues();
        if (editingVenue && editingVenue._id === venueId) {
          handleCancelEdit();
        }
      })
      .catch(error => {
        console.error("Error deleting venue:", error);
        alert("Failed to delete venue. Please try again.");
      });
  };

  return (
    <div className="container p-3">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map(venue => (
              <tr key={venue._id}>
                <td>{venue.Name}</td>
                <td>{venue.City || 'N/A'}</td>
                <td>{venue.Country || 'N/A'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => handleEditClick(venue)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDeleteVenue(venue._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {venues.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No venues found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingVenue && (
        <div className="mt-4">
          <h5>Edit Venue: {editingVenue.Name}</h5>
          <form onSubmit={handleUpdateVenue}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Update Venue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ModifyVenueModalContent;