import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ArtistModalContent from './ArtistModalContent';
import VenueModalContent from './VenueModalContent';
import ModifyArtistsModalContent from './ModifyArtistsModalContent';
import ModifyVenueModalContent from './ModifyVenueModalContent';

function UpdateConcert() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [artist, setArtist] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [posterURL, setPosterUrl] = useState('');
  
  const [artists, setArtists] = useState([]);
  const [venues, setVenues] = useState([]);
  
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showArtistListModal, setShowArtistListModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showVenueListModal, setShowVenueListModal] = useState(false);
 
  useEffect(() => {
    console.log("Fetching concert with ID:", id);
   
    axios.get('https://server-pearl-three-79.vercel.app/getConcert/' + id)
      .then(result => {
        console.log("API Response:", result.data);
       
        setArtist(result.data.Artist || '');
        setVenue(result.data.Venue || '');
        setPosterUrl(result.data.PosterURL || '');
        setDescription(result.data.Description || '');
        setDate((result.data.Date).split('T')[0]);
      })
      .catch(error => {
        console.log("Error fetching concert:", error);
      });
  }, [id]);
  
  function fetchArtists() {
    axios.get(process.env.SERVER_URL+"getArtists")
      .then(result => {
        const artistData = result.data;
        setArtists(artistData.map(artist => artist.Name));
      })
      .catch(error => {
        console.error("Error fetching artists:", error);
      });
  }

  function fetchVenues() {
    axios.get(process.env.SERVER_URL+"getVenues")
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
    } 
    else if(value === "Modify existing artists"){
      setShowArtistListModal(true);
    }
    else if (value !== "") { 
      setArtist(value);
    }
  }
  
  function handleVenueSelectionChanged(value) {
    if (value === "Add new venue") {
      setShowVenueModal(true);
    } 
    else if(value === "Modify existing venues"){
      setShowVenueListModal(true);
    }
    else if (value !== "") {
      setVenue(value);
    }
  }
  
  function handleArtistAdded(newArtistData) {
    setArtists([...artists, newArtistData.Name]);
    setArtist(newArtistData.Name);
    setShowArtistModal(false);
  }

  function handleVenueAdded(newVenueData) {
    setVenues([...venues, newVenueData.Name]);
    setVenue(newVenueData.Name);
    setShowVenueModal(false);
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();
   
    axios.patch(process.env.SERVER_URL+"updateConcert/" + id, { 
      Artist: artist, 
      Venue: venue, 
      Date: date, 
      Description: description, 
      PosterURL: posterURL 
    })
      .then(result => {
        console.log(result);
        alert("Concert updated!");
        navigate('/concerts');
      })
      .catch(error => console.log(error));
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: '400px' }}>
        <h4 className="mb-4 text-center">Update Concert</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Artist</label>
            <select className="form-select" value={artist}onChange={(e) => handleArtistSelectionChanged(e.target.value)}>
              <option value="" style={{ color: '#6c757d' }}>Select Artist</option>
              {artists.map((artistName, index) => (
                <option key={index} value={artistName}> {artistName} </option>
              ))}
              <option value="Modify existing artists" style={{ color: '#6c757d' }}>Modify existing artists</option>
              <option value="Add new artist" style={{ color: '#6c757d' }}>Add new artist</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Venue</label>
            <select className="form-select" value={venue}
              onChange={(e) => handleVenueSelectionChanged(e.target.value)}
            >
              <option value="">Select Venue</option>
              {venues.map((venueName, index) => (
                <option key={index} value={venueName}>{venueName}</option>
              ))}
              <option value="Modify existing venues">Modify existing venues</option>
              <option value="Add new venue">Add new venue</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input type="text" placeholder="Enter description" className="form-control" required value={description} onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Poster URL</label>
            <input type="text" placeholder="Enter poster url" className="form-control" required value={posterURL} onChange={(e) => setPosterUrl(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button 
            type="submit" 
            className="btn btn-success w-100"
            disabled={!artist || !venue || !date}
          >
            Update Concert
          </button>
        </form>
      </div>

      {showArtistModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Artist</h5>
                <button type="button" className="btn-close" onClick={() => {setShowArtistModal(false); fetchArtists()}}></button>
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
                <button type="button" className="btn-close" onClick={() => {setShowVenueModal(false); fetchVenues()}}></button>
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
                <button type="button" className="btn-close" onClick={() => {setShowArtistListModal(false);fetchArtists}}></button>
              </div>
              <div className="modal-body p-0">
                <ModifyArtistsModalContent onCancel={() =>  {setShowArtistListModal(false);fetchArtists}} />
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
                <button type="button" className="btn-close" onClick={() => {setShowVenueListModal(false); fetchVenues()}}></button>
              </div>
              <div className="modal-body p-0">
                <ModifyVenueModalContent onCancel={() =>{setShowVenueListModal(false); fetchVenues()}} />
              </div>
            </div>
          </div>
        </div>
        )
      }
      {(showArtistModal || showVenueModal || showArtistListModal||showVenueListModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
}

export default UpdateConcert;