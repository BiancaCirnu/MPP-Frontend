import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModifyArtistsModalContent({ onCancel }) {
  const [artists, setArtists] = useState([]);
  const [editingArtist, setEditingArtist] = useState(null);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [monthlyListeners, setMonthlyListeners] = useState('');

  // Fetch all artists on component mount
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = () => {
    axios.get(import.meta.env.VITE_SERVER_URL+"/getArtists")
      .then(result => {
        setArtists(result.data);
      })
      .catch(error => {
        console.error("Error fetching artists:", error);
      });
  };

  const handleEditClick = (artist) => {
    setEditingArtist(artist);
    setName(artist.Name);
    setGenre(artist.Genre || '');
    setMonthlyListeners(artist.MonthlyListeners || '');
  };

  const handleCancelEdit = () => {
    setEditingArtist(null);
    setName('');
    setGenre('');
    setMonthlyListeners('');
  };

  const handleUpdateArtist = (e) => {
    e.preventDefault();
    
    const updatedArtist = {
      Name: name,
      Genre: genre,
      MonthlyListeners: parseInt(monthlyListeners, 10) || 0
    };

    axios.patch(import.meta.env.VITE_SERVER_URL + `/updateArtist/${editingArtist._id}`, updatedArtist)
      .then(result => {
        fetchArtists();
        handleCancelEdit();
      })
      .catch(error => {
        console.error("Error updating artist:", error);
      });
  };

  const handleDeleteArtist = (artistId) => {
    axios.delete(import.meta.env.VITE_SERVER_URL+`/deleteArtist/${artistId}`)
      .then(result => {
        fetchArtists();
        if (editingArtist && editingArtist._id === artistId) {
          handleCancelEdit();
        }
      })
      .catch(error => {
        console.error("Error deleting artist:", error);
    });
  };

  return (
    <div className="container p-3">
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Genre</th>
              <th>Monthly Listeners</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(artist => (
              <tr key={artist._id}>
                <td>{artist.Name}</td>
                <td>{artist.Genre || 'N/A'}</td>
                <td>{artist.MonthlyListeners?.toLocaleString() || '0'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => handleEditClick(artist)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDeleteArtist(artist._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {artists.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No artists found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingArtist && (
        <div className="mt-4">
          <h5>Edit Artist: {editingArtist.Name}</h5>
          <form onSubmit={handleUpdateArtist}>
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
              <label className="form-label">Genre</label>
              <input
                type="text"
                className="form-control"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Monthly Listeners</label>
              <input
                type="number"
                className="form-control"
                value={monthlyListeners}
                onChange={(e) => setMonthlyListeners(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Update Artist
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ModifyArtistsModalContent;