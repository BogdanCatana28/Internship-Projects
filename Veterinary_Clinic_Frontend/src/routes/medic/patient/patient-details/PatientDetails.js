import '../../../../App.css';
import '../view-patients/PatientsView.css';
import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import requestInstance from "../../../../utils/RequestInstance";

function PatientDetails() {
    const [patient, setPatient] = useState({
        patientName: "",
        patientBirthdate: "",
        patientWeight: "",
        patientBreed: "",
        patientColour: "",
        patientSex: "",
        patientType: "",
        patientMedicalHistoryBeforeClinic: "",
        owner: ""
    });
    const [consultations, setConsultations] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        loadPatient();
        loadConsultations();
        // eslint-disable-next-line
    }, []);

    const loadPatient = async () => {
        try {
            const response = await requestInstance.get(`http://localhost:8080/patients/${id}`);
            setPatient(response.data);
        } catch (error) {
            console.error('Error loading patient:', error);
        }
    }

    const loadConsultations = async () => {
        try {
          const response = await requestInstance.get(`http://localhost:8080/consultations/consultations/by-patient/${id}`);
          // Sort the consultations by date in descending order
          const sortedConsultations = response.data.sort((a, b) => new Date(b.consultationCreationDate) - new Date(a.consultationCreationDate));
          setConsultations(sortedConsultations);
          console.log(sortedConsultations);
        } catch (error) {
          console.error('Error loading consultations:', error);
        }
      };

    return (
        <div className='container patient-profile-size'>
            <div className='row'>
                <div className='col-md-12'>
                    {/* Boxul mare pentru detalii pacient */}
                    <div className='border rounded p-4 m-4 shadow'>
                        <h2 className='text-center m-4 fs-1 patient-bold-text'>Patient Profile</h2>
                        <div className='row'>
                            <div className='col-md-6'>
                                {/* Sub-box pentru detalii pacient */}
                                <div className='card mb-4 patient-card-color'>
                                    <div className='card-header fs-4 patient-bold-text'>
                                        Patient Details
                                    </div>
                                    <ul className='list-group list-group-flush'>
                                        <li className='list-group-item'>
                                            <b>Name: </b>{patient.patientName}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Species: </b>{patient.patientType}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Breed: </b>{patient.patientBreed}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Sex: </b>{patient.patientSex}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Weight: </b>{patient.patientWeight}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Color: </b>{patient.patientColour}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Birth Date: </b>{patient.patientBirthdate}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Medical history: </b>{patient.patientMedicalHistoryBeforeClinic}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                {/* Sub-box pentru detalii proprietar */}
                                <div className='card patient-card-color'>
                                    <div className='card-header fs-4 patient-bold-text'>
                                        Owner Details
                                    </div>
                                    <ul className='list-group list-group-flush'>
                                        <li className='list-group-item'>
                                            <b>First Name: </b>{patient.owner.firstName}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Last Name: </b>{patient.owner.lastName}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Address: </b>{patient.owner.address}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Phone: </b>{patient.owner.phone}
                                        </li>
                                        <li className='list-group-item'>
                                            <b>Email: </b>{patient.owner.email}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='row mt-4 ml-2'>
                                <h3 className='text-center m-4 fs-3 patient-bold-text'>Consultation history</h3>
                                {consultations.length > 0 ? (
                                    consultations.map(consultation => (
                                        <div key={consultation.consultationId} className='col-md-4 mb-4'>
                                            <div className='card'>
                                                <div className='card-body card-body-consult patient-card-color'>
                                                    <h5 className='card-title-consult-date patient-bold-text w-100'>{consultation.consultationCreationDate}</h5>
                                                    <p className='card-text'>
                                                        <span className='fs-6 patient-bold-text'>Main concern:</span> {consultation.consultationMainConcern}
                                                    </p>
                                                    <p className='card-text'>
                                                        <span className='fs-6 patient-bold-text'>History of concern:</span> {consultation.consultationHistoryOfConcern}
                                                    </p>
                                                    <p className='card-text'>
                                                        <span className='fs-6 patient-bold-text'>Diagnostic:</span> {consultation.consultationDiagnostic}
                                                    </p>
                                                    <p className='card-text'>
                                                        <span className='fs-6 patient-bold-text'>Treatment:</span> {consultation.consultationTreatment}
                                                    </p>
                                                    <p className='card-text'>
                                                        <span className='fs-6 patient-bold-text'>Extra notes:</span> {consultation.consultationExtraNotes}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center mt-4 mb-4'>
                                        <p className='fs-5 patient-bold-text ml-2'>&nbsp;    &nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No consultation history available</p>
                                    </div>
                                )}
                            </div>

                            <div className='row'>
                                <div className='col'>
                                    <Link className='back-and-consult-button' to={"/medic/dashboard/patients"}>Back</Link>
                                </div>
                                <div className='col'>
                                    <Link className='back-and-consult-button' to={`/medic/dashboard/consultation-form/${id}`}>Add consultation</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default PatientDetails;