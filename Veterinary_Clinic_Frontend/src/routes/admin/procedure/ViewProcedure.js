import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProcedureService from '../../../services/ProcedureService';
import eventBus from '../../../utils/EventBus';

const ViewProcedure = () => {
  const [procedure, setProcedure] = useState({});
  const [error, setError] = useState(null);

  // Get the procedure ID from the URL using useParams
  const { id } = useParams();

  useEffect(() => {
    // Fetch the procedure by its ID when the component mounts
    ProcedureService.showProcedureById(id)
      .then((response) => {
        setProcedure(response.data);
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
  }, [id]); // Include 'id' in the dependency array to fetch the procedure when 'id' changes

  // Join the specializations array with both spaces and commas
  const specializationsString = procedure.specializations
    ? procedure.specializations.join(', ')
    : '';

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Procedure details</h2>
          <div className="card">
            <div className="card-header">
              Details of procedure ID: {id}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Name: </b>
                  {procedure.name}
                </li>
                <li className="list-group-item">
                  <b>Duration: </b>
                  {procedure.duration}
                </li>
                <li className="list-group-item">
                  <b>Price: </b>
                  {procedure.price}
                </li>
                <li className="list-group-item">
                  <b>Specializations: </b>
                  {specializationsString}
                </li>
                <li className="list-group-item">
                  <b>Anesthesia: </b>
                  {procedure.anesthesia ? 'Yes' : 'No'}
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to="/admin/dashboard/procedures">
            Back to Procedures
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewProcedure;
