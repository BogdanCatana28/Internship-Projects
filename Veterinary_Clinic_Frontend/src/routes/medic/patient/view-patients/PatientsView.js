import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import SearchPatient from './SearchPatient';
import requestInstance from "../../../../utils/RequestInstance";
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientsView.css';

function PatientsView() {
    const [searchResults, setSearchResults] = useState([]);
    const [patients, setPatients] = useState([]);
    const [types, setTypes] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [sexes, setSexes] = useState([]);
    const [colors, setColors] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [ages, setAges] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [weights, setWeights] = useState([]);
  
    const [selectedType, setSelectedType] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [selectedSex, setSelectedSex] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedWeight, setSelectedWeight] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
  
    const manualAgeRanges = [
      '0-1', '1-2', '3-4', '5-9', '10-19', '20-29', '30-49', '50+'
    ];
    const manualWeightRanges = [
      '0-1', '1-2', '3-4', '5-9', '10-19', '20-29', '30-49', '50+'
    ];
  
  
    const loadPatients = async () => {
      const result = await requestInstance.get('http://localhost:8080/patients');
      setPatients(result.data);
    };
  
    const fetchTypes = async () => {
      try {
        const response = await requestInstance.get('http://localhost:8080/type');
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
  
    const fetchBreeds = async () => {
      try {
        const response = await requestInstance.get('http://localhost:8080/breed');
        setBreeds(response.data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };
  
    const fetchSexes = async () => {
      try {
        const response = await requestInstance.get('http://localhost:8080/sex');
        setSexes(response.data);
      } catch (error) {
        console.error('Error fetching sexes:', error);
      }
    };
  
    const fetchColors = async () => {
      try {
        const response = await requestInstance.get('http://localhost:8080/color');
        setColors(response.data);
      } catch (error) {
        console.log('Error fetching colors:', error);
      }
    };
  
    const calculateAge = (patientBirthdate) => {
      const currentDate = new Date();
      const birthDateObj = new Date(patientBirthdate);
      const ageInYears = currentDate.getFullYear() - birthDateObj.getFullYear();
  
      if (
        currentDate.getMonth() < birthDateObj.getMonth() ||
        (currentDate.getMonth() === birthDateObj.getMonth() && currentDate.getDate() < birthDateObj.getDate())
      ) {
        return ageInYears - 1;
      } else {
        return ageInYears;
      }
    };
  
    const isInAgeRange = (patientBirthdate, ageRange) => {
      const currentDate = new Date();
      const birthDateObj = new Date(patientBirthdate);
      const ageInYears = currentDate.getFullYear() - birthDateObj.getFullYear();
  
      const [minAge, maxAge] = ageRange.split('-').map(Number);
  
      return ageInYears >= minAge && ageInYears <= maxAge;
    };
  
    const isInWeightRange = (patientWeight, range) => {
      const [min, max] = range.split('-').map(Number);
      return patientWeight >= min && patientWeight <= max;
    };
  
    function applyFilters(term)  {
      let filteredPatients = patients;
  
      if (selectedType !== '') {
        filteredPatients = filteredPatients.filter(patient => patient.patientType === selectedType);
      }
  
      if (selectedBreed !== '') {
        filteredPatients = filteredPatients.filter(patient => patient.patientBreed === selectedBreed);
      }
  
      if (selectedSex !== '') {
        filteredPatients = filteredPatients.filter(patient => patient.patientSex === selectedSex);
      }
  
      if (selectedColor !== '') {
        filteredPatients = filteredPatients.filter(patient => patient.patientColour === selectedColor);
      }
  
      if (selectedAge !== '') {
        filteredPatients = filteredPatients.filter(patient => isInAgeRange(patient.patientBirthdate, selectedAge));
      }
  
      if (selectedWeight !== '') {
        filteredPatients = filteredPatients.filter(patient => isInWeightRange(patient.patientWeight, selectedWeight));
      }
  
      if (term) {
        filteredPatients = filteredPatients.filter((patient) =>
          patient.patientName.toLowerCase().includes(term.toLowerCase())
        );
      }
  
      return filteredPatients;
    };
  
    const handleSearch = (term) => {
      setSearchTerm(term);
    
      const filteredPatients = applyFilters(term); 
      
      setSearchResults(filteredPatients);
    };
  
    const handleReset = () => {
      setSelectedType('');
      setSelectedBreed('');
      setSelectedSex('');
      setSelectedColor('');
      setSelectedAge('');
      setSelectedWeight('');
      setSearchTerm('');
    };
  
    useEffect(() => {
      loadPatients();
      fetchTypes();
      fetchBreeds();
      fetchSexes();
      fetchColors();
    }, []);
  
    useEffect(() => {
      const filteredPatients = applyFilters();
  
      setSearchResults(filteredPatients);
  
      const uniqueTypes = [...new Set(filteredPatients.map((patient) => patient.patientType))];
      setTypes(uniqueTypes);
  
      const uniqueBreeds = [...new Set(filteredPatients.map((patient) => patient.patientBreed))];
      setBreeds(uniqueBreeds);
  
      const uniqueSexes = [...new Set(filteredPatients.map((patient) => patient.patientSex))];
      setSexes(uniqueSexes);
  
      const uniqueColors = [...new Set(filteredPatients.map((patient) => patient.patientColour))];
      setColors(uniqueColors);
  
      const uniqueAges = [...new Set(filteredPatients.map((patient) => calculateAge(patient.patientBirthdate)))];
      setAges(uniqueAges);
  
      const uniqueWeights = [...new Set(filteredPatients.map((patient) => patient.patientWeight))];
      setWeights(uniqueWeights);
      // eslint-disable-next-line
    }, [searchTerm, patients, selectedType, selectedBreed, selectedSex, selectedColor, selectedAge, selectedWeight]);
  
  
    return (
  
      <div className='container mt-5 mb-5 patient-profile-size'>
      {/* Boxul mare pentru lista pacienti */}
      <div className='border rounded p-4 mt-2 shadow'>
        <h2 className='text-center m-4 fs-1'>Patients </h2>
      <div className='row'>
        <div className='big-width'>
              <div className='search-height w-100 mb-4'> 
                {/* containerul pentru search */}
                
                  <SearchPatient onSearch={handleSearch} />
                
                </div>
                  {/* containerul pentru card-uri */}
                <div className='card-deck'>
                  {searchResults.map((patient, index) => (
                    <div className='card card-container mb-4 patient-card-color' key={patient.id}>

                      <div className='card-body-patient mb-4'>
                        <div className='row w-100 padding-patient-list'>
                          <div className='col-12'>
                            <h5 className='card-title fs-3 fw-bold'>{patient.patientName}</h5>
                          </div>
                          <div className='mt-2 col text-center-filter'>
                            <p className='font-patient-list fw-normal'><strong>Type:</strong><br/> {patient.patientType}</p>
                            <p className='font-patient-list fw-normal'><strong>Breed:</strong><br/> {patient.patientBreed}</p>
                          </div>
                          <div className='mt-2 col text-center-filter'>
                            <p className='font-patient-list fw-normal'><strong>Sex:</strong><br/> {patient.patientSex}</p>
                            <p className='font-patient-list fw-normal'><strong>Color:</strong><br/> {patient.patientColour}</p>
                          </div>
                          <div className='mt-2 col text-center-filter'>
                            <p className='font-patient-list fw-normal'><strong>Birth Date:</strong><br/> {patient.patientBirthdate}</p>
                            <p className='font-patient-list fw-normal'><strong>Weight:</strong><br/> {patient.patientWeight}</p>
                          </div>
                          <div className='mt-auto mb-5 card-details-button-position'> 
                            <Link className='card-details-button' to={`/medic/dashboard/patient-details/${patient.id}`}>
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
        </div>
        <div className='small-width'>
            <div className='card m-0 patient-card-color'>
                <h3 className='text-center mt-2'>Filters</h3> 
                <div className="select-container">
                    <label className="text-center-filter align-self-center">Type:</label>
                    
                      <select
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e.target.value);
                        }}
                      >
                        <option value=''>All</option>
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      
                      <button type="button" className="btn-close red-clear-button img mt-2 ml-3" aria-label="Close" title='clear'
                          style={{ visibility: selectedType ? 'visible' : 'hidden' }}
                          onClick={() => {
                            setSelectedType('');
                            setSelectedBreed('');
                          }}
                        />
                       

                      
                    
                  </div>

                              <div className="select-container">
                              
                                <label className="text-center-filter align-self-center">Breed:</label>
                                  <select
                                    value={selectedBreed}
                                    onChange={(e) => setSelectedBreed(e.target.value)}
                                  >
                                    <option value=''>All</option>
                                    {breeds.map((breed) => (
                                    <option key={breed} value={breed}>
                                      {breed}
                                    </option>
                                  ))}
                                  </select>
                                  
                                  <button type="button" className="btn-close img mt-2 ml-3" aria-label="Close" title='clear'
                                    style={{ visibility: selectedBreed ? 'visible' : 'hidden' }}
                                    onClick={() => {
                                      setSelectedBreed('');
                                    }}
                                  />
                                  
                              </div>
                             
                               

                              <div className="select-container">
                                <label className="text-center-filter align-self-center">Sex:</label>
                                <select value={selectedSex} onChange={(e) => setSelectedSex(e.target.value)}>
                                  <option value=''>All</option>
                                  {sexes.map((sex) => (
                                    <option key={sex} value={sex}>
                                      {sex}
                                    </option>
                                  ))}
                                </select>
                                
                                <button type="button" className="btn-close btn-close-orange img mt-2 ml-3" aria-label="Close" title='clear'
                                  style={{ visibility: selectedSex ? 'visible' : 'hidden' }}
                                  onClick={() => {
                                    setSelectedSex('');
                                  }}
                                />
                                
                              </div>

                              <div className="select-container">
                                <label className="text-center-filter align-self-center">Color:</label>
                                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                                  <option value=''>All</option>
                                  {colors.map((color) => (
                                    <option key={color} value={color}>
                                      {color}
                                    </option>
                                  ))}
                                </select>
                                <button type="button" className="btn-close img mt-2 ml-3" aria-label="Close" title='clear'
                                  style={{ visibility: selectedColor ? 'visible' : 'hidden' }}
                                  onClick={() => {
                                    setSelectedColor('');
                                  }}
                                />
                              </div>

                              <div className="select-container">
                                <label className="text-center-filter align-self-center">Age:</label>
                                <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
                                  <option value=''>All</option>
                                  {manualAgeRanges.map((ageRange) => (
                                    <option key={ageRange} value={ageRange}>
                                      {ageRange}
                                    </option>
                                  ))}
                                </select>
                                <button type="button" className="btn-close img mt-2 ml-3" aria-label="Close" title='clear'
                                  style={{ visibility: selectedAge ? 'visible' : 'hidden' }}
                                  onClick={() => {
                                    setSelectedAge('');
                                  }}
                                />  
                              </div>

                              <div className="select-container">
                              <label className="text-center-filter align-self-center">Weight:</label>
                              <select value={selectedWeight} onChange={(e) => setSelectedWeight(e.target.value)}>
                                <option value=''>All</option> 
                                {manualWeightRanges.map((weightRange) => (
                                  <option key={weightRange} value={weightRange}>
                                    {weightRange}
                                  </option>
                                ))}
                              </select>
                                <button type="button" className="btn-close mx-auto align-self-center" aria-label="Close" title='clear'
                                style={{ visibility: selectedWeight ? 'visible' : 'hidden' }}
                                onClick={() => {
                                  setSelectedWeight('');
                                }}
                              />
                            </div>

                          
                            
                                <button className='btn-block mx-auto mb-2 text-center reset-search-and-details-button' onClick={handleReset}>
                                  Reset All
                                </button>
                            
                 </div>
        </div>
      </div>
          
          
            
            
              
                
                   
                    
            
                  
              
              
                  
                 
          </div>
         
    </div>

                            
        
                
    
    );
    
  }
  
  export default PatientsView;