import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pencil, Trash, ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import axios from 'axios';

function Concerts() {
  const [concerts, setConcerts] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    artist: '',
    venue: ''
  });
  const [sorting, setSorting] = useState({
    field: 'Date',
    direction: 'asc' // 'asc' or 'desc'
  });
  const [venues, setVenues] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get('https://server-9gutn6tzh-biancas-projects-5418afa9.vercel.app:3001/getConcerts')
      .then(result => {
        const concertsData = result.data;
        setConcerts(concertsData);
        setFilteredConcerts(concertsData);
      })
      .catch(error => {
        console.error("Error fetching concerts:", error);
        setError("Failed to load concerts. Please try again later.");
      });
  }, []);

  useEffect(()=>{
    axios.get("https://server-9gutn6tzh-biancas-projects-5418afa9.vercel.app:3001/getArtists")
    .then(result => {
        const artistData = result.data;
        setArtists(artistData.map(artist=>artist.Name));
      })
      .catch(error => {
        console.error("Error fetching artists:", error);
      });
  }, []);

  useEffect(()=>{
    axios.get("https://server-9gutn6tzh-biancas-projects-5418afa9.vercel.app:3001/getVenues")
    .then(result => {
        const venuesData = result.data;
        setVenues(venuesData.map(venue=>venue.Name));
      })
      .catch(error => {
        console.error("Error fetching venues:", error);
      });
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [concerts, filters, sorting]);

  const applyFiltersAndSorting = () => {
    let result = [...concerts];
    
    // Apply filters
    if (filters.artist) {
      result = result.filter(concert => concert.Artist === filters.artist);
    }
    if (filters.venue) {
      result = result.filter(concert => concert.Venue === filters.venue);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sorting.field === 'Date') {
        const dateA = new Date(a.Date || '1970-01-01');
        const dateB = new Date(b.Date || '1970-01-01');
        return sorting.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sorting.field === 'Artist') {
        const artistA = a.Artist || '';
        const artistB = b.Artist || '';
        return sorting.direction === 'asc' 
          ? artistA.localeCompare(artistB) 
          : artistB.localeCompare(artistA);
      }
      return 0;
    });
    
    setFilteredConcerts(result);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (field) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this concert?")) {
      axios.delete(`https://server-pearl-three-79.vercel.app:3001/deleteConcert/${id}`)
        .then(response => {
          console.log("Delete response:", response.data);
          const updatedConcerts = concerts.filter(c => c._id !== id);
          setConcerts(updatedConcerts);
        })
        .catch(error => {
          console.error("Error deleting concert:", error);
          alert("Failed to delete concert. Please try again.");
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getSortIcon = (field) => {
    if (sorting.field !== field) return null;
    return sorting.direction === 'asc' ? <ArrowUp /> : <ArrowDown />;
  };

  const clearFilters = () => {
    setFilters({ artist: '', venue: '' });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Upcoming Concerts</h2>
        <Link to="/create" className="btn btn-success">
          + Add Concert
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Filtering and Sorting Controls */}
      <div className="card mb-4 p-3 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Filter by Artist</label>
            <select 
              className="form-select"
              value={filters.artist}
              onChange={(e) => handleFilterChange('artist', e.target.value)}
            >
              <option value="">All Artists</option>
              {artists.map((artist, index) => (
                <option key={index} value={artist}>{artist}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Filter by Venue</label>
            <select 
              className="form-select"
              value={filters.venue}
              onChange={(e) => handleFilterChange('venue', e.target.value)}
            >
              <option value="">All Venues</option>
              {venues.map((venue, index) => (
                <option key={index} value={venue}>{venue}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button 
              className="btn btn-outline-secondary me-2" 
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="row mt-3">
          <div className="col-12">
            <div className="btn-group">
              <button 
                className={`btn ${sorting.field === 'Date' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('Date')}
              >
                Sort by Date {getSortIcon('Date')}
              </button>
              <button 
                className={`btn ${sorting.field === 'Artist' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('Artist')}
              >
                Sort by Artist {getSortIcon('Artist')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredConcerts.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h5>No concerts match your filters.</h5>
          <p>Try changing your filter criteria or <button className="btn btn-link p-0" onClick={clearFilters}>clear all filters</button>.</p>
        </div>
      ) : (
        <div className="concert-list">
          {filteredConcerts.map((concert) => (
            <div key={concert._id} className="card mb-4 shadow-sm">
              <div className="row g-0">
                <div className="col-md-3">
                  <div className="poster-container bg-light d-flex justify-content-center align-items-center h-100" style={{ height: '240px' }}>
                    {concert.PosterURL ? (
                      <img 
                        src={concert.PosterURL} 
                        alt="Couldn't load the image"
                        style={{ height: '200px', width: 'auto', objectFit: 'contain' }}
                        className="img-fluid rounded-start"
                      />
                    ) : (
                      <div className="text-center text-muted p-4">
                        <div className="fs-1 mb-2">🎵</div>
                        <div>Poster</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <h3 className="card-title">{concert.Artist}</h3>
                      </div>
                      <div className="col-md-4">
                        <h5 className="text-muted">{concert.Venue}</h5>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="badge bg-primary mb-2">{formatDate(concert.Date)}</div>
                      <p className="card-text">
                        {concert.Description || 'No description available for this concert.'}
                      </p>
                    </div>
                    
                    <div className="row mt-auto">
                      <div className="col">
                        <div className="d-flex gap-2">
                          <Link 
                            to={`/update/${concert._id}`} 
                            className="btn btn-outline-primary w-100"
                          >
                            <Pencil className="me-1" /> Update
                          </Link>
                          <button 
                            className="btn btn-outline-danger w-100" 
                            onClick={() => handleDelete(concert._id)}
                          >
                            <Trash className="me-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Concerts;