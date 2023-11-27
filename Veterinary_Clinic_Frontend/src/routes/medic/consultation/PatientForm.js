import React, {useState, useEffect} from "react";
import {Field, ErrorMessage} from "formik";
import {GET_PATIENT_SEXES_URL, GET_PATIENT_TYPES_URL} from "../../../utils/Consts";
import RequestInstance from "../../../utils/RequestInstance";
import "./AddConsultationPage.css"

export default function PatientForm({preloadedData, errors, touched}) {

    /************************* PATIENT_TYPES *************************/
    const [patientTypes, setPatientTypes] = useState([]);
    const fetchPatientTypes = () => {
        console.log("fetching")
        return RequestInstance.get(GET_PATIENT_TYPES_URL)
            // .then((response) => response.json())
            .then((data) => {
                return data.data;
            })
            .then(patientTypes => setPatientTypes(patientTypes))
    }

    /************************* PATIENT_SEX *************************/
    const [patientSexes, setPatientSexes] = useState([]);
    const fetchPatientSex = () => {
        console.log("fetching")
        return RequestInstance.get(GET_PATIENT_SEXES_URL)
            // .then((response) => response.json())
            .then((data) => {
                return data.data;
            })
            .then(patientSexes => setPatientSexes(patientSexes))
    }

    useEffect(() => {
        fetchPatientTypes();
        fetchPatientSex();
    }, []);
//a good practice it's to declare all the useState, firstly in the file.
    return (
        <div className="consulation-form-card">
            <h3 className="consulation-form-subtitle">Patient</h3>
            <div>

                <div className="consulation-form-group">
                    <label className="consulation-form-label" htmlFor="patientName">Name</label>
                    <Field
                        name="patientName"
                        type="text"
                        disabled={true}
                        className={   
                            (errors.patientName && touched.patientName ? " red-error-message" : "")
                        }
                    />
                    <div>
                        {errors.patientName && touched.patientName?
                            <ErrorMessage
                                name="patientName"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                <div className="consulation-form-group ">
                    <label className="consulation-form-label" htmlFor="patientType">Type</label>
                    <Field
                        name="patientType"
                        type="text"
                        as="select"
                        disabled={true}
                        className={
                            (errors.patientType && touched.patientType ? " red-error-message" : "")
                        }
                        onClick={fetchPatientTypes}
                    >

                        <option value="" className="consulation-form-option">Choose</option>
                        {
                            patientTypes.map(option => {
                                return (
                                    <option key={option} value={option} className="consulation-form-option">
                                        {option}
                                    </option>
                                )
                            })
                        }
                    </Field>
                    <div>
                        {errors.patientType && touched.patientType?
                            <ErrorMessage
                                name="patientType"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                <div className="consulation-form-group">
                    <label  className="consulation-form-label" htmlFor="patientBreed">Breed</label>
                    <Field
                        name="patientBreed"
                        type="text"
                        disabled={true}
                        className={   
                            (errors.patientBreed && touched.patientBreed ? " red-error-message" : "")
                        }
                    />
                    <div>
                        {errors.patientBreed && touched.patientBreed?
                            <ErrorMessage
                                name="patientBreed"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                <div className="consulation-form-group ">
                    <label  className="consulation-form-label" htmlFor="patientColour">Colour</label>
                    <Field
                        name="patientColour"
                        type="text"
                        className={   
                            (errors.patientColour && touched.patientColour ? " red-error-message" : "")
                        }
                    />
                    <div>
                        {errors.patientColour && touched.patientColour?
                            <ErrorMessage
                                name="patientColour"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                <div className="consulation-form-group">
                    <label className="consulation-form-label" htmlFor="patientSex">Sex</label>
                    <Field
                        name="patientSex"
                        type="text"
                        as="select"
                        disabled={true}
                        className={   
                            (errors.patientSex && touched.patientSex ? " red-error-message" : "")
                        }
                    >
                        <option value="">Choose</option>
                        {
                            patientSexes.map(option => {
                                return (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                )
                            })
                        }
                    </Field>
                    <div>
                        {errors.patientSex && touched.patientSex?
                            <ErrorMessage
                                name="patientSex"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                <div className="consulation-form-group ">
                    <label  className="consulation-form-label" htmlFor="patientWeight">Weight
                        (kgs)</label>
                    <Field
                        name="patientWeight"
                        type="text"
                        className={   
                            (errors.patientWeight && touched.patientWeight ? " red-error-message" : "")
                        }
                    />
                    <div>
                        {errors.patientWeight && touched.patientWeight?
                            <ErrorMessage
                                name="patientWeight"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                <div className="consulation-form-group">
                    <label className="consulation-form-label" htmlFor="patientBirthdate">Birthdate</label>
                    <Field
                        name="patientBirthdate"
                        type="date"
                        disabled={true}
                        className={   
                            (errors.patientBirthdate && touched.patientBirthdate ? " red-error-message" : "")
                        }
                    />
                    <div>
                        {errors.patientBirthdate && touched.patientBirthdate?
                            <ErrorMessage
                                name="patientBirthdate"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>
            </div>
        </div>

    );
};
