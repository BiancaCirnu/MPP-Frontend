import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArtistModalContent from './ArtistModalContent';
import VenueModalContent from './VenueModalContent';
import ModifyArtistsModalContent from './ModifyArtistsModalContent';
import ModifyVenueModalContent from './ModifyVenueModalContent';
function CreateConcert() {
  const navigate = useNavigate();
 
  const [artist, setArtist] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [posterURL, setPosterUrl] = useState('');
  const [description, setDescription] = useState('');
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showArtistListModal, setShowArtistListModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showVenueListModal, setShowVenueListModal] = useState(false);
 
  const submit = (e) => {
    e.preventDefault();
    axios.post(import.meta.env.VITE_SERVER_URL+"createConcert", { Artist: artist, Venue: venue, Date: date, PosterURL: posterURL, Description: description})
      .then(result => {
        console.log(result);
        alert("Concert added!");
        navigate('/concerts');
      })
      .catch(error => console.log(error));
  };
 
    function fetchArtists() {
    axios.get(import.meta.env.VITE_SERVER_URL+"getArtists")
      .then(result => {
        const artistData = result.data;
        setArtists(artistData.map(artist => artist.Name));
      })
      .catch(error => {
        console.error("Error fetching artists:", error);
      });
  }

  function fetchVenues() {
    axios.get(import.meta.env.VITE_SERVER_URL+"getVenues")
      .then(result => {
        const venuesData = result.data;
        setVenues(venuesData.map(venue => venue.Name));
      })
      .catch(error => {
        console.error("Error fetching venues:", error);
      });
  }

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    fetchVenues();
  }, []);

  function handleArtistSelectionChanged(value) {
    if (value === "Add new artist") {
      setShowArtistModal(true);
      setArtist(''); 
    } 
    else if(value === "Modify existing artists"){
      setShowArtistListModal(true);
    }
    else if (value !== "") {
      setArtist(value);
    }
  }
  
  function handleArtistAdded(newArtistData) {
    setArtists([...artists, newArtistData.Name]);
    setArtist(newArtistData.Name);
    setShowArtistModal(false);
  }

  function handleVenueSelectionChanged(value) {
    if (value === "Add new venue") {
      setShowVenueModal(true);
      setVenue(''); 
    } 
    else if(value === "Modify existing venues"){
      setShowVenueListModal(true);
    }
    else if (value !== "") { 
      setVenue(value);
    }
  }

  function handleVenueAdded(newVenueData) {
    setVenues([...venues, newVenueData.Name]);
    setVenue(newVenueData.Name);
    setShowVenueModal(false);
  }



  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: '400px' }}>
        <h4 className="mb-4 text-center">Add Concert</h4>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Artist</label>
            <select className="form-select" value={artist} onChange={(e) => handleArtistSelectionChanged(e.target.value)} >
              <option value="" style={{ color: '#6c757d' }}>Select Artist</option>
              {artists.map((artistName, index) => (
                <option key={index} value={artistName}>{artistName}</option>
              ))}
              <option value="Modify existing artists" style={{ color: '#6c757d' }}>Modify existing artists</option>
              <option value="Add new artist" style={{ color: '#6c757d' }}>Add new artist</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Venue</label>
            <select className="form-select" value={venue} onChange={(e) => handleVenueSelectionChanged(e.target.value)}>
              <option value="" style={{ color: '#6c757d' }}>Select Venue</option>
              {venues.map((venueName, index) => (
                <option key={index} value={venueName}>{venueName}</option>
              ))}
              <option value="Modify existing venues" style={{ color: '#6c757d' }}>Modify existing venues</option>
              <option value="Add new venue"style={{ color: '#6c757d' }}>Add new venue</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input type="text" placeholder="Enter description" className="form-control" required value={description}
              onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Poster URL</label>
            <input type="text" placeholder="Enter poster URL" className="form-control" required value={posterURL}
              onChange={(e) => setPosterUrl(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" required value={date}
              onChange={(e) => setDate(e.target.value)}/>
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={!artist || !venue || !date}> Add Concert </button>
          <button type="cancel" className="btn btn-fail w-100 mt-2" onClick={()=>navigate("/concerts")}> Cancel </button>
        </form>
      </div>

      {showArtistModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Artist</h5>
                <button type="button" className="btn-close" onClick={() => setShowArtistModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                <ArtistModalContent onArtistAdded={handleArtistAdded} onCancel={() => setShowArtistModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showVenueModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Venue</h5>
                <button type="button" className="btn-close" onClick={() => setShowVenueModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                <VenueModalContent onVenueAdded={handleVenueAdded} onCancel={() => setShowVenueModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showArtistListModal&&(
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Artists</h5>
                <button type="button" className="btn-close" onClick={() => {setShowArtistListModal(false);fetchArtists()}}></button>
              </div>
              <div className="modal-body p-0">
                <ModifyArtistsModalContent onCancel={() => {setShowArtistListModal(false);fetchArtists()} }/>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVenueListModal&&(
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Venues</h5>
                <button type="button" className="btn-close" onClick={() =>{ setShowVenueListModal(false); fetchVenues()}}></button>
              </div>
              <div className="modal-body p-0">
                <ModifyVenueModalContent onCancel={() =>{ setShowVenueListModal(false); fetchVenues()}}/>
              </div>
            </div>
          </div>
        </div>
        )
      }
      {(showArtistModal || showVenueModal || showArtistListModal|| showVenueListModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
}

export default CreateConcert;
