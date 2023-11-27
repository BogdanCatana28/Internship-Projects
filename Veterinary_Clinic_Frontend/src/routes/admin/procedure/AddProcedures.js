import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProcedureService from '../../../services/ProcedureService';
import './add-procedures.css';
import './EditProcedure.css';
import TimedPopup from "../../../components/popup/TimedPopup";

function AddProcedure() {
  const navigate = useNavigate();

  const [procedure, setProcedure] = useState({
    name: '',
    duration: '',
    price: '',
    specializations: [],
    anesthesia: '',
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupMessageType, setPopupMessageType] = useState("");
  function checkNumber(string) {
    return /^[0-9]*$/.test(string);
  }
  const [specializationOptions, setSpecializationOptions] = useState([
    'PATHOLOGIST', 'SMALL_ANIMAL', 'ANESTHESIOLOGY', 'DENTISTRY', 'SURGERY'// Add your specialization options here
  ]);

  const { name, duration, price, specializations, anesthesia } = procedure;

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'specializations') {
      const specializationsArray = value.split(',');
      setProcedure({ ...procedure, [name]: specializationsArray });
    } else {
      setProcedure({ ...procedure, [name]: value });
    }
  };


  const addSpecialization = (option) => {
    setProcedure({
      ...procedure,
      specializations: [...specializations, option],
    });
  };

  const removeLastSpecialization = () => {
    if (specializations.length > 0) {
      const updatedSpecializations = specializations.slice(0, -1); // Remove the last element
      setProcedure({
        ...procedure,
        specializations: updatedSpecializations,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!checkNumber(duration) || !checkNumber(price)){
        setIsPopupVisible(true);
        setPopupMessage("Duration and price must be numbers!");
        setPopupMessageType("error");
        return;
      }
      await ProcedureService.addProcedure(procedure);
      setIsPopupVisible(true);
      setPopupMessage("Procedure deleted successfully! Redirecting...");
      setPopupMessageType("success");
      // navigate('/admin/dashboard/procedures');
    } catch (error) {
      console.error('Error adding procedure:', error);
      setIsPopupVisible(true);
      if(/parse/.test( error.response.data.message) === true){
        setPopupMessage("Specialization must be one of the mentioned ones!");
      }else {
        setPopupMessage(error.response.data.message);
      }
      setPopupMessageType("error");
    }
  };

  useEffect(() => {
    const handleBackspace = (e) => {
      if (e.keyCode === 8) {
        // 8 is the keycode for Backspace
        removeLastSpecialization();
      }
    };

    document.addEventListener('keydown', handleBackspace);

    return () => {
      document.removeEventListener('keydown', handleBackspace);
    };
  }, [specializations]);

  return (
      <>
        {isPopupVisible &&
            <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                        setIsVisible={setIsPopupVisible} redirect={`/admin/dashboard/procedures`} timer={2000}></TimedPopup>}
      <div className="edit-procedure-component-resize-height edit-procedure-form-center">
        <div className="edit-procedure-form-card col-xs-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 col-xxl-3">
          <div className="edit-procedure-form-title">
            <h1><em>Procedure</em> Add</h1>
          </div>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="edit-procedure-form-group">
              <label htmlFor="name" className=" edit-procedure-form-label">
                Name
              </label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter procedure name"
                  required
              />
            </div>
            <div className="edit-procedure-form-group">
              <label htmlFor="duration" className=" edit-procedure-form-label">
                Duration (minutes)
              </label>
              <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={duration}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter procedure duration"
                  required
              />
            </div>
            <div className="edit-procedure-form-group">
              <label htmlFor="price" className=" edit-procedure-form-label">
                Price
              </label>
              <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter procedure price"
                  required
              />
            </div>
            <div className="edit-procedure-form-group">
              <label htmlFor="specializations" className=" edit-procedure-form-label">
                Specializations
              </label>
              <input
                  type="text"
                  id="specializations"
                  name="specializations"
                  value={specializations.join(', ')}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter procedure specializations"
                  required
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
                      checked={anesthesia === 'false'}
                      onChange={(e) => onInputChange(e)}
                      className="radio-input"
                  />
                  <label htmlFor="anesthesiaFalse" className="edit-procedure-form-label-simple">No</label>
                </div>
              </div>
            </div>
            <div className='Add-Procedure-buttons col-md-12 edit-procedure-form-group'>
              <button type="submit" className="btn btn-success col-md-6" style={{ minWidth: '100px', height: '40px' }}>
                Add procedure
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

export default AddProcedure;
//Make a convensions to the name of files, or add-procedures.css, edit-procedures.css, or EditProcedures, AddProcedures, a prefer the second one