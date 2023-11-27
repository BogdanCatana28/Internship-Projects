import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RequestInstance from "../../../../utils/RequestInstance";
import { Link } from 'react-router-dom';

function PatientConsultDetails() {
    const { consultationId } = useParams();

    const [consultation, setConsultation] = useState({
        consultationCreationDate: "",
        consultationDiagnostic: "",
        consultationMainConcern: "",
        consultationHistoryOfConcern: "",
        consultationTreatment: "",
        consultationExtraNotes: "",
    });

    useEffect(() => {
        loadConsultationDetails();
    }, []);

    const loadConsultationDetails = async () => {
        try {
            const response = await RequestInstance.get(`http://localhost:8080/consultations/consultations/${consultationId}`);
            setConsultation(response.data);
        } catch (error) {
            console.error('Error loading consultation details:', error);
        }
    }

    return (
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card mb-4'>
                <div className='card-header'>
                  Detalii Consultație
                </div>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    <b>Consultation date: </b>{consultation.consultationCreationDate}
                  </li>
                  <li className='list-group-item'>
                    <b>Diagnostic: </b>{consultation.consultationDiagnostic}
                  </li>
                  <li className='list-group-item'>
                    <b>Main concern: </b>{consultation.consultationMainConcern}
                  </li>
                  <li className='list-group-item'>
                    <b>History of concern: </b>{consultation.consultationHistoryOfConcern}
                  </li>
                  <li className='list-group-item'>
                    <b>Treatment: </b>{consultation.consultationTreatment}
                  </li>
                  <li className='list-group-item'>
                    <b>Extra notes: </b>{consultation.consultationExtraNotes}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='row'>
                <div className='col-md-12'>
                    <Link to={`/viewPatients/${consultation.patientId}`} className='btn btn-primary'>
                        Back
                    </Link>
                </div>
            </div>
        </div>
      );
}

export default PatientConsultDetails;
