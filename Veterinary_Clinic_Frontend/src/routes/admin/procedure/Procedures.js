import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProcedureService from '../../../services/ProcedureService';
import eventBus from '../../../utils/EventBus';
import './Procedures.css';
import TimedPopup from "../../../components/popup/TimedPopup";

const Procedures = () => {
  const navigate = useNavigate();
  const [procedures, setProcedures] = useState([]);
  const [error, setError] = useState(null);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupMessageType, setPopupMessageType] = useState("");

  useEffect(() => {
    ProcedureService.showProcedures()
      .then((response) => {
        setProcedures(response.data);
      })
      .catch((error) => {
        setError(
          (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        );

        if (error.response && error.response.status === 401) {
          eventBus.dispatch('logout');
        }
      });
  }, []);

  const deleteProcedure = (id) => {
    ProcedureService.deleteProcedure(id)
      .then(() => {
        // Update the procedures state to remove the deleted procedure
        setProcedures((prevProcedures) => prevProcedures.filter((procedure) => procedure.id !== id));
        setIsPopupVisible(true);
        setPopupMessage("Procedure deleted successfully!");
        setPopupMessageType("success");
      })
      .catch((error) => {
        // Handle the error
        setIsPopupVisible(true);
        setPopupMessage("Cannot delete procedure because it's used for appointments!");
        setPopupMessageType("error");
        console.error('Error deleting procedure:', error);
      });
  };

  const handleAddButtonClick = () => {
    navigate('/admin/dashboard/add-procedure'); // Redirect to the "/addProcedure" page
  };

  return (
    <>
      {isPopupVisible &&
          <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                      setIsVisible={setIsPopupVisible}></TimedPopup>}
    <div className="container-procedures view-procedure-resize">

      <div className="table-procedures">
        <div className="d-flex procedures justify-content-between align-items-center mb-3 ">
          <div>
            <h1><em>Procedures</em> view</h1>
          </div>
          <button className="btn btn-success" onClick={handleAddButtonClick}>
            + Add Procedure
          </button>
        </div>
        <div className="table-responsive">
        <table className=" border shadow table  procedures-table-border" >
          <thead>
            <tr>
              <th scope="col"  style={{ backgroundColor: '#24615E', color: 'white' }}>ID</th>
              <th scope="col" style={{ backgroundColor: '#24615E', color: 'white' }}>Name</th>
              <th scope="col" style={{ backgroundColor: '#24615E', color: 'white' }}>Duration</th>
              <th scope="col" style={{ backgroundColor: '#24615E', color: 'white' }}>Price</th>
              <th scope="col" style={{ backgroundColor: '#24615E', color: 'white' }}>Specializations</th>
              <th scope="col" style={{ backgroundColor: '#24615E', color: 'white' }}>Anesthesia</th>
              <th scope="col" style={{ backgroundColor: '#24615E', color: 'white' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {procedures.map((procedure, index) => (
              <tr key={procedure.id}>
                <td>{index + 1}</td>
                <td>{procedure.name}</td>
                <td>{procedure.duration}</td>
                <td>{procedure.price}</td>
                <td>{procedure.specializations.join(', ')}</td>
                <td>{procedure.anesthesia ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-success mx-2 " style={{ minWidth: '100px', height: '40px' }} onClick={()=> navigate(`/admin/dashboard/edit-procedure/${procedure.id}`)}>
                      Edit
                  </button>
                  <button
                    className="btn btn-danger mx-2 " style={{ minWidth: '100px', height: '40px' }}
                    onClick={() => deleteProcedure(procedure.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default Procedures;
