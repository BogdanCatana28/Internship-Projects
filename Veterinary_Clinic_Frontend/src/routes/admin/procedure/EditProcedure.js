import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProcedureService from '../../../services/ProcedureService';
import './add-procedures.css';
import './EditProcedure.css';
import TimedPopup from "../../../components/popup/TimedPopup";

function EditProcedure() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [procedure, setProcedure] = useState({
    name: '',
    duration: '',
    price: '',
    specializations: [],
    anesthesia: '',
  });

  const [specializationOptions, setSpecializationOptions] = useState([
    'PATHOLOGIST', 'SMALL_ANIMAL', 'ANESTHESIOLOGY', 'DENTISTRY', 'SURGERY'
  ]);

  useEffect(() => {
    loadProcedure();
  }, []);

  const loadProcedure = async () => {
    try {
      const result = await ProcedureService.showProcedureById(id);
      // Pre-fill the form fields with existing procedure data
      setProcedure(result.data);
    } catch (error) {
      console.error('Error loading procedure:', error);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'specializations') {
      const specializationsArray = value.split(',').map((item) => item.trim());
      setProcedure({ ...procedure, [name]: specializationsArray });
    } else {
      setProcedure({ ...procedure, [name]: value });
    }
  };

  const addSpecialization = (option) => {
    if (!procedure.specializations.includes(option)) {
      const updatedSpecializations = [...procedure.specializations, option];
      setProcedure({
        ...procedure,
        specializations: updatedSpecializations,
      });
    }
  };

  const removeLastSpecialization = () => {
    if (procedure.specializations.length > 0) {
      const updatedSpecializations = [...procedure.specializations];
      updatedSpecializations.pop(); // Remove the last element
      setProcedure({
        ...procedure,
        specializations: updatedSpecializations,
      });
    }
  };

  const handleBackspace = (e) => {
    if (e.keyCode === 8 && e.target.value === '') {
      // Handle Backspace key press and the input field is empty
      removeLastSpecialization();
    }
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupMessageType, setPopupMessageType] = useState("");
  function checkNumber(string) {
    return /^[0-9]*$/.test(string);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!checkNumber(procedure.duration) || !checkNumber(procedure.price)){
        setIsPopupVisible(true);
        setPopupMessage("Duration and price must be numbers!");
        setPopupMessageType("error");
        return;
      }
      await ProcedureService.updateProcedure(procedure, id);
      setIsPopupVisible(true);
      setPopupMessage("Procedure updated! Redirecting...");
      setPopupMessageType("success");
      // navigate('/admin/dashboard/procedures');
    } catch (error) {
      setIsPopupVisible(true);
      if(/parse/.test( error.response.data.message) === true){
        setPopupMessage("Specialization must be one of the mentioned ones!");
      }else {
        setPopupMessage(error.response.data.message);
      }
      setPopupMessageType("error");
      console.error('Error updating procedure:', error);
    }
  };

  return (
      <>
        {isPopupVisible &&
            <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                        setIsVisible={setIsPopupVisible} timer={2000} redirect={'/admin/dashboard/procedures'}></TimedPopup>}
      <div className="edit-procedure-component-resize-height edit-procedure-form-center">
        <div className="edit-procedure-form-card col-xs-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 col-xxl-3">
          <div className="edit-procedure-form-title">
            <h1><em>Procedure</em> Edit</h1>
          </div>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="edit-procedure-form-group">
              <label htmlFor="name" className=" edit-procedure-form-label">
                Name
              </label>
              <input
                type="text"
                className=" "
                placeholder="Enter procedure Name"
                name="name"
                value={procedure.name} // Pre-fill the name field
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="edit-procedure-form-group">
              <label htmlFor="duration" className=" edit-procedure-form-label">
                Duration (minutes)
              </label>
              <input
                type="text"
                className=" "
                placeholder="Enter Procedure duration"
                name="duration"
                value={procedure.duration} // Pre-fill the duration field
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="edit-procedure-form-group">
              <label htmlFor="price" className=" edit-procedure-form-label">
                Price
              </label>
              <input
                type="text"
                className=" "
                placeholder="Enter procedure price"
                name="price"
                value={procedure.price} // Pre-fill the price field
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="edit-procedure-form-group">
              <label htmlFor="specializations" className=" edit-procedure-form-label">
                Specializations
              </label>
              <input
                type="text"
                className=" "
                placeholder="Enter Procedure specializations (comma-separated)"
                name="specializations"
                value={procedure.specializations.join(',')} // Pre-fill the specializations field
                onChange={(e) => onInputChange(e)}
                onKeyDown={handleBackspace} // Handle Backspace key press
              />
              <div className="specializations-dropdown edit-procedure-transparent">
                <ul>
                {specializationOptions.map((option) => (
                      <li key={option} onClick={() => addSpecialization(option)} >
                        {option}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="radio-container edit-procedure-form-group d-inline-block">
              <label className=" edit-procedure-form-label pt-1">Anesthesia</label>
              <div className="edit-procedure-margin-left">
              <div className='buttons-space'></div>
              <div className=" form-check-inline  ">
                <input
                  type="radio"
                  id="anesthesiaTrue"
                  name="anesthesia"
                  value="true"
                  checked={procedure.anesthesia === 'true'}
                  onChange={(e) => onInputChange(e)}
                  className="form-check-input"
                />
                <label htmlFor="anesthesiaTrue" className="edit-procedure-form-label-simple">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="anesthesiaFalse"
                  name="anesthesia"
                  value="false"
                  checked={procedure.anesthesia === 'false'}
                  onChange={(e) => onInputChange(e)}
                  className="form-check-input"
                />
                <label htmlFor="anesthesiaFalse" className="edit-procedure-form-label-simple">No</label>
              </div>
              </div>
            </div>
            <div className='Add-Procedure-buttons col-md-12 edit-procedure-form-group'>
              <button type="submit" className="btn btn-success col-md-6" style={{ minWidth: '100px', height: '40px' }}>
                Update
              </button>
              <button className="btn btn-danger col-md-6" style={{ minWidth: '100px', height: '40px' }} onClick={()=>navigate(`/admin/dashboard/procedures`)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      </>
  );
}

export default EditProcedure;
