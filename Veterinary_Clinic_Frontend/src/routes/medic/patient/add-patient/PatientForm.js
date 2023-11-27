import React, {useState, useEffect} from "react";
import {Field, ErrorMessage} from "formik";
import {GET_PATIENT_SEXES_URL, GET_PATIENT_TYPES_URL} from "../../../../utils/Consts";
import RequestInstance from "../../../../utils/RequestInstance";
import "./AddPatientPage.css"

export default function PatientForm({errors, touched}) {
    /* == PATIENT_AGE == */
    const [age, setItAge] = useState(false)
    const [birthday, setItBirthday] = useState(false)
    const years = [];
    for (let i = 0; i <= 100; i++) {
        years.push(i.toString());
    }
    const months = [];
    for (let i = 0; i <= 12; i++) {
        months.push(i.toString());
    }

    /* == PATIENT_TYPES == */
    const [patientTypes, setPatientTypes] = useState([]);
    const fetchPatientTypes = () => {
        return RequestInstance.get(GET_PATIENT_TYPES_URL)
            .then((data) => {
                return data.data;
            })
            .then(patientTypes => setPatientTypes(patientTypes))
    }

    /* == PATIENT_SEX == */
    const [patientSexes, setPatientSexes] = useState([]);
    const fetchPatientSex = () => {
        return RequestInstance.get(GET_PATIENT_SEXES_URL)
            .then((data) => {
                return data.data;
            })
            .then(patientSexes => setPatientSexes(patientSexes))
    }

    useEffect(() => {
        fetchPatientTypes();
        fetchPatientSex();
    }, []);

    return (
        <div>
            {/* == PATIENT == */}
            <h3 className="green-patient-form-subtitle">Patient</h3>
            <div>

                {/* == PATIENT NAME == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientName">Name</label>
                    <Field
                        name="patientName"
                        type="text"
                        className={(errors.patientName && touched.patientName ? " red-error-message" : "")}
                        placeholder="Bob"
                    />
                    <div>
                        {errors.patientName && touched.patientName ?
                            <ErrorMessage
                                name="patientName"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                {/* == PATIENT TYPE == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientType">Type</label>
                    <Field
                        name="patientType"
                        type="text"
                        as="select"
                        className={(errors.patientType && touched.patientType ? " red-error-message" : "")}
                    >
                        <option value="">Choose</option>
                        {
                            patientTypes.map(option => {
                                return (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                )
                            })
                        }
                    </Field>
                    <div>
                        {errors.patientType && touched.patientType ?
                            <ErrorMessage
                                name="patientType"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>


                {/* == PATIENT BREED == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientBreed">Breed</label>
                    <Field
                        name="patientBreed"
                        type="text"
                        className={(errors.patientBreed && touched.patientBreed ? " red-error-message" : "")}
                        placeholder="sfinx"
                    />
                    <div>
                        {errors.patientBreed && touched.patientBreed ?
                            <ErrorMessage
                                name="patientBreed"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                {/* == PATIENT COLOUR == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientColour">Colour</label>
                    <Field
                        name="patientColour"
                        type="text"
                        className={"form-control text-field" +
                            (errors.patientColour && touched.patientColour ? " red-error-message" : "")
                        }
                        placeholder="pink"
                    />
                    <div>
                        {errors.patientColour && touched.patientColour ?
                            <ErrorMessage
                                name="patientColour"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                {/* == PATIENT SEX == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientSex">Sex</label>
                    <Field
                        name="patientSex"
                        type="text"
                        as="select"
                        className={(errors.patientSex && touched.patientSex ? " red-error-message" : "")}
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
                        {errors.patientSex && touched.patientSex ?
                            <ErrorMessage
                                name="patientSex"
                                component="div"
                                className="invalid-feedback"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                {/* == PATIENT WEIGHT == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientWeight">Weight
                        (kgs)</label>
                    <Field
                        name="patientWeight"
                        type="text"
                        className={(errors.patientWeight && touched.patientWeight ? " red-error-message" : "")}
                        placeholder="3.5"
                    />
                    <div>
                        {errors.patientWeight && touched.patientWeight ?
                            <ErrorMessage
                                name="patientWeight"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                {/* == PATIENT AGE == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="age">Age</label>
                    <div className="add-patient-form-element">

                        <label className="add-patient-padding-item">
                            <Field type="radio" name="age" value="Birthdate"
                                   onClick={() => {
                                       setItBirthday(true);
                                       setItAge(false);
                                   }}/>
                            Birthdate
                        </label>

                        <label className="add-patient-padding-item">
                            <Field type="radio" name="age" value="Age"
                                   onClick={() => {
                                       setItBirthday(false);
                                       setItAge(true);
                                   }}/>
                            Age
                        </label>

                        <label className="add-patient-padding-item">
                            <Field type="radio" name="age" value="Unknown"
                                   onClick={() => {
                                       setItBirthday(false);
                                       setItAge(false);
                                   }}/>
                            Unknown
                        </label>

                    </div>

                    <div>
                        {errors.age && touched.age ?
                            <ErrorMessage
                                name="age"
                                component="div"
                                className="input-error-message"
                            /> :
                            // Used to take space on the page when there is no error
                            <span className="hidden-error-message">Error</span>}
                    </div>
                </div>

                {age ?
                    <div className="add-patient-form-inline-display-age ">

                        {/* == PATIENT AGE YEARS == */}
                        <div className="add-patient-form-group add-patient-form-element-margin-right">
                            <label className="add-patient-form-label" htmlFor="patientAgeYears">Years</label>
                            <Field
                                name="patientAgeYears"
                                type="text"
                                as="select"
                                className={(errors.patientAgeYears && touched.patientAgeYears ? " red-error-message" : "")}
                            >
                                <option value="">Choose</option>
                                {
                                    years.map(option => {
                                        return (
                                            <option key={option.label} value={option.value}>
                                                {option}
                                            </option>
                                        )
                                    })
                                }
                            </Field>
                            <div>
                                {errors.patientAgeYears && touched.patientAgeYears ?
                                    <ErrorMessage
                                        name="patientAgeYears"
                                        component="div"
                                        className="input-error-message"
                                    /> :
                                    // Used to take space on the page when there is no error
                                    <span className="hidden-error-message">Error</span>}
                            </div>
                        </div>

                        {/* == PATIENT AGE MONTHS == */}
                        <div className="add-patient-form-group add-patient-form-element-margin-left">
                            <label className="add-patient-form-label" htmlFor="patientAgeMonths">Months</label>
                            <Field
                                name="patientAgeMonths"
                                type="text"
                                as="select"
                                className={(errors.patientAgeMonths && touched.patientAgeMonths ? " red-error-message" : "")}
                            >
                                <option value="">Choose</option>
                                {
                                    months.map(option => {
                                        return (
                                            <option key={option.label} value={option.value}>
                                                {option}
                                            </option>
                                        )
                                    })
                                }
                            </Field>
                            <div>
                                {errors.patientAgeMonths && touched.patientAgeMonths ?
                                    <ErrorMessage
                                        name="patientAgeMonths"
                                        component="div"
                                        className="input-error-message"
                                    /> :
                                    // Used to take space on the page when there is no error
                                    <span className="hidden-error-message">Error</span>}
                            </div>
                        </div>
                    </div>
                    : ''}

                {/* == PATIENT BIRTHDATE == */}
                {birthday ?

                    <div className="add-patient-form-group">
                        <label className="add-patient-form-label" htmlFor="patientBirthdate">Birthdate</label>
                        <Field
                            name="patientBirthdate"
                            type="date"
                            className={(errors.patientBirthdate && touched.patientBirthdate ? " is-invalid" : "")}
                        />
                        <div>
                            {errors.patientBirthdate && touched.patientBirthdate ?
                                <ErrorMessage
                                    name="patientBirthdate"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>
                    : ''}

                {/* == PATIENT HISTORY == */}
                <div className="add-patient-form-group">
                    <label className="add-patient-form-label" htmlFor="patientMedicalHistoryBeforeClinic">Medical history</label>
                    <Field
                        name="patientMedicalHistoryBeforeClinic"
                        as="textarea"
                        className={(errors.patientMedicalHistoryBeforeClinic && touched.patientMedicalHistoryBeforeClinic ? " is-invalid" : "")}
                        placeholder="unknown"
                    />
                    <div>
                        {errors.patientMedicalHistoryBeforeClinic && touched.patientMedicalHistoryBeforeClinic ?
                            <ErrorMessage
                                name="patientMedicalHistoryBeforeClinic"
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
}

//the file it's too big