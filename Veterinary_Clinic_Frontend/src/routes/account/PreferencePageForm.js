import React, {useEffect, useState} from "react";
import "./AccountPage.css"
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import TokenService from "../../services/TokenService";
import RequestInstance from "../../utils/RequestInstance"
import {ErrorMessage, Field, Form, Formik} from "formik";

import {Link, useNavigate} from 'react-router-dom';
import {GET_PATIENT_SEXES_URL, GET_PATIENT_TYPES_URL} from "../../utils/Consts";
import TimedPopup from "../../components/popup/TimedPopup";

export function PreferencesForm({preloadedData,setReload}) {
    const [successful, setSuccessful] = useState(false);
    const user = TokenService.getUser();

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

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [petName, setPetName] = useState("");
    const [petBreed, setPetBreed] = useState("");
    const [petType, setPetType] = useState("");
    const [petSex, setPetSex] = useState("");
    const [petAge, setPetAge] = useState("");
    const [petColour, setPetColour] = useState("");
    const [selectedPreferenceId, setSelectedPreferenceId] = useState("");

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupMessageType, setPopupMessageType] = useState("");


    useEffect(() => {
        fetchPatientTypes();
        fetchPatientSex();
    }, []);

    const validationSchema = Yup.object().shape({
        // OWNER
        firstName: Yup.string()
            .required("This field is required!"),
        lastName: Yup.string()
            .required("This field is required!"),
        email: Yup.string()
            .email("This is not a valid email."),

        // PATIENT
        petName: Yup.string()
            .required("This field is required!"),
        petWeight: Yup.number()
            .test("value",
                "The weight must be between 0 and 2000",
                (val) => val >= 0 && val <= 2000),
        petAge: Yup.number(),
    });

    function checkNumber(string) {
        return /^[0-9]*$/.test(string);
    }

    const handleUserPreferenceRequest = () => {

        const customerId = user.id;

        if(!checkNumber(petAge)){
            setIsPopupVisible(true);
            setPopupMessage("Age must be a number!");
            setPopupMessageType("error");
            return;
        }

        RequestInstance.post(`http://localhost:8080/user-preferences`,
            {
                customerId,
                firstName,
                lastName,
                address,
                phone,
                email,
                name: petName,
                breed: petBreed,
                type: petType,
                sex: petSex,
                age: petAge,
                colour: petColour
            })
            .then(response => {
                setIsPopupVisible(true);
                setPopupMessage("Preference added!");
                setPopupMessageType("success");
                setReload(true);
            })
            .catch(error => {
                setIsPopupVisible(true);
                setPopupMessage(error.response.data.message);
                setPopupMessageType("error");
            })
    }

    const handleUserPreferenceUpdateRequest = () => {
        const customerId = user.id;

        if(!checkNumber(petAge)){
            setIsPopupVisible(true);
            setPopupMessage("Age must be a number!");
            setPopupMessageType("error");
            return;
        }

        RequestInstance.put(`http://localhost:8080/user-preferences/${selectedPreferenceId}`,
            {
                id: selectedPreferenceId,
                customerId,
                firstName,
                lastName,
                address,
                phone,
                email,
                name: petName,
                breed: petBreed,
                type: petType,
                sex: petSex,
                age: petAge,
                colour: petColour
            })
            .then(response => {
                setIsPopupVisible(true);
                setPopupMessage("Preference updated!");
                setPopupMessageType("success");
                setReload(true);
            })
            .catch(error => {
                setIsPopupVisible(true);
                setPopupMessage(error.response.data.message);
                setPopupMessageType("error");
            })
    }

    const handleUserPreferenceDeleteRequest = async () => {
        RequestInstance.delete(`http://localhost:8080/user-preferences/${selectedPreferenceId}`)
            .then(response => {
                setIsPopupVisible(true);
                setPopupMessage("Preference deleted!");
                setPopupMessageType("success");
                setReload(true);
                resetStates();
                setNewPreference(false);
            })
            .catch(error => {
                setIsPopupVisible(true);
                setPopupMessage(error.response.data.message);
                setPopupMessageType("error");
            })
    }

    const [newPreference, setNewPreference] = useState(false);
    const [updatePreference, setUpdatePreference] = useState(false);
    const [preferencesExist, setPreferencesExist] = useState(false);

    function addFirstPreferenceHadler() {
        setNewPreference(true);
        setPreferencesExist(true);
    }
    //You don't use this function
    function getPreference(preferenceId) {
        return RequestInstance.get(`http://localhost:8080/user-preferences/${preferenceId}`)
    }

    function resetStates(){
        setEmail("");
        setFirstName("");
        setLastName("");
        setAddress("");
        setPhone("");
        setPetName("");
        setPetAge("");
        setPetBreed("");
        setPetColour("");
        setPetSex("");
        setPetType("");
        setSelectedPreferenceId("")
    }

    async function handleSelectPreference(event) {
        console.log(event.target.value);
        if (event.target.value === "Save a new preference") {
            setNewPreference(true);
            setUpdatePreference(false);
            resetStates();
        } else if (event.target.value === "Click to select an option") {
            setNewPreference(false);
            setUpdatePreference(false);
        } else {
            //update data
            setNewPreference(true);
            setUpdatePreference(true);
            const preference = await getPreference(event.target.value)
                .then(response => {
                    return response.data;
                })
                .catch(error => {
                    console.log(error)
                });
            console.log("preference:");
            if (preference) {
                setEmail(preference.email);
                setFirstName(preference.firstName);
                setLastName(preference.lastName);
                setAddress(preference.address);
                setPhone(preference.phone);
                setPetName(preference.name);
                setPetAge(preference.age);
                setPetBreed(preference.breed);
                setPetColour(preference.colour);
                setPetSex(preference.sex)
                setPetType(preference.type);
                setSelectedPreferenceId(preference.id);
            }
        }

    }

    const initialValues = {
        // OWNER
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
        email: "",
        // PET
        petName: "",
        petBreed: "",
        petType: "",
        petSex: "",
        petAge: ""
    };

    const navigate = useNavigate();
    const navigateToAccount = () => {
        navigate(`/account`);
    }

    return (
        <>
            {isPopupVisible &&
                <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                            setIsVisible={setIsPopupVisible}></TimedPopup>}
        <div
            className={"account-page" + (newPreference ? " big-form-component-resize " : " small-form-component-resize ")}>
            {/* NAVIGATION BUTTONS */}
            <div className="routing-buttons">
                <button role="button" className="account-navigation-button" onClick={navigateToAccount}>Account</button>
                <button role="button" className="account-navigation-button preferences-button">
                    Preferences
                </button>
            </div>

            <div className=" mb-5 green-form ">
                <div>

                    <div className="extra-info">
                        <p>Select one of your preferences to see more details</p>
                        <p>If you don't already have one you can choose the add option</p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        // validationSchema={validationSchema}
                        // onSubmit={handleUserPreferenceRequest}
                    >
                        {({errors, touched}) => (
                            <Form>
                                {!successful && (
                                    <div>

                                        <div>
                                            {/*  OWNER  */}
                                        </div>
                                        <div>
                                            <label htmlFor="preferences" className="field-label">Saved
                                                preferences</label>
                                            <Field
                                                name="preferences"
                                                type="text"
                                                className="form-control text-field"
                                                as="select"
                                                size={2}
                                                onChange={handleSelectPreference}
                                            >
                                                <option className="preferences-form-option">Click to select an option
                                                </option>
                                                <option className="preferences-form-option">Save a new preference
                                                </option>
                                                {
                                                    preloadedData.map(option => {
                                                        return (
                                                            <option key={option.id} value={option.id}
                                                                    className="preferences-form-option">
                                                                {option.firstName + " " + option.lastName + " " + option.name}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </Field>
                                            <div>
                                                {errors.preferences && touched.preferences ?
                                                    <ErrorMessage
                                                        name="preferences"
                                                        component="div"
                                                        className="input-error-message"
                                                    /> :
                                                    // Used to take space on the page when there is no error
                                                    <span className="hidden-error-message">Error</span>}
                                            </div>
                                        </div>

                                        {
                                            newPreference ?
                                                <>
                                                    <div>
                                                        <label htmlFor="firstName" className="field-label">First
                                                            Name *</label>
                                                        <Field
                                                            name="firstName"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.firstName && touched.firstName ? " red-error-message" : "")
                                                            }
                                                            value={firstName}
                                                            onChange={(event) => setFirstName(event.target.value)}
                                                            placeholder="John"
                                                        />
                                                        <div>
                                                            {errors.firstName && touched.firstName ?
                                                                <ErrorMessage
                                                                    name="firstName"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="lastName" className="field-label">Last
                                                            Name *</label>
                                                        <Field
                                                            name="lastName"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.lastName && touched.lastName ? " red-error-message" : "")
                                                            }
                                                            value={lastName}
                                                            onChange={(event) => setLastName(event.target.value)}
                                                            placeholder="Doe"
                                                        />
                                                        <div>
                                                            {errors.lastName && touched.lastName ?
                                                                <ErrorMessage
                                                                    name="lastName"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="email" className="field-label">Email</label>
                                                        <Field
                                                            name="email"
                                                            type="email"
                                                            className={"form-control" +
                                                                (errors.email && touched.email ? " red-error-message" : "")
                                                            }
                                                            value={email}
                                                            onChange={(event) => setEmail(event.target.value)}
                                                            placeholder="jonnie@gmail.com"
                                                        />
                                                        <div>
                                                            {errors.email && touched.email ?
                                                                <ErrorMessage
                                                                    name="email"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="address"
                                                               className="field-label">Address</label>
                                                        <Field
                                                            name="address"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.address && touched.address ? " red-error-message" : "")
                                                            }
                                                            value={address}
                                                            onChange={(event) => setAddress(event.target.value)}
                                                            placeholder="Doplhin Street nr34, Bear Land"
                                                        />
                                                        <div>
                                                            {errors.address && touched.address ?
                                                                <ErrorMessage
                                                                    name="address"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="phone" className="field-label">Phone</label>
                                                        <Field
                                                            name="phone"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.phone && touched.phone ? " red-error-message" : "")
                                                            }
                                                            value={phone}
                                                            onChange={(event) => setPhone(event.target.value)}
                                                            placeholder="0712333555"
                                                        />
                                                        <div>
                                                            {errors.phone && touched.phone ?
                                                                <ErrorMessage
                                                                    name="phone"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="petName" className="field-label">Pet
                                                            name *</label>
                                                        <Field
                                                            name="petName"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.petName && touched.petName ? " red-error-message" : "")
                                                            }
                                                            value={petName}
                                                            onChange={(event) => setPetName(event.target.value)}
                                                            placeholder="Bob"
                                                        />
                                                        <div>
                                                            {errors.petName && touched.petName ?
                                                                <ErrorMessage
                                                                    name="petName"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="petBreed" className="field-label">Pet
                                                            breed *</label>
                                                        <Field
                                                            name="petBreed"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.petBreed && touched.petBreed ? " red-error-message" : "")
                                                            }
                                                            value={petBreed}
                                                            onChange={(event) => setPetBreed(event.target.value)}
                                                            placeholder="Terrier"
                                                        />
                                                        <div>
                                                            {errors.petBreed && touched.petBreed ?
                                                                <ErrorMessage
                                                                    name="petBreed"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="petColour" className="field-label">Pet
                                                            colour</label>
                                                        <Field
                                                            name="petColour"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.petColour && touched.petColour ? " red-error-message" : "")
                                                            }
                                                            placeholder="Blue"
                                                            value={petColour}
                                                            onChange={(event) => setPetColour(event.target.value)}
                                                        />
                                                        <div>
                                                            {errors.petColour && touched.petColour ?
                                                                <ErrorMessage
                                                                    name="petColour"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="petAge" className="field-label">Pet age
                                                            (months)</label>
                                                        <Field
                                                            name="petAge"
                                                            type="text"
                                                            className={"form-control" +
                                                                (errors.petAge && touched.petAge ? " red-error-message" : "")
                                                            }
                                                            value={petAge}
                                                            onChange={(event) => setPetAge(event.target.value)}
                                                            placeholder="46"
                                                        />
                                                        <div>
                                                            {errors.petAge && touched.petAge ?
                                                                <ErrorMessage
                                                                    name="petAge"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="petType" className="field-label">Pet
                                                            type *</label>
                                                        <Field
                                                            name="patientType"
                                                            type="text"
                                                            as="select"
                                                            className={(errors.patientType && touched.patientType ? " red-error-message" : "")}
                                                            value={petType}
                                                            onChange={(event) => setPetType(event.target.value)}
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
                                                            {errors.petType && touched.petType ?
                                                                <ErrorMessage
                                                                    name="petType"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>


                                                    <div>
                                                        <label htmlFor="petSex" className="field-label">Pet sex *</label>
                                                        <Field
                                                            name="patientSex"
                                                            type="text"
                                                            as="select"
                                                            className={(errors.patientSex && touched.patientSex ? " red-error-message" : "")}
                                                            value={petSex}
                                                            onChange={(event) => setPetSex(event.target.value)}
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
                                                            {errors.petSex && touched.petSex ?
                                                                <ErrorMessage
                                                                    name="petSex"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    {updatePreference ? (
                                                        <div>
                                                            <button type="submit"
                                                                    className="form-submit-button"
                                                                    onClick={handleUserPreferenceUpdateRequest}
                                                            >
                                                                Update preference
                                                            </button>
                                                            <button type="submit"
                                                                    className="form-delete-button"
                                                                    onClick={handleUserPreferenceDeleteRequest}
                                                            >
                                                                Delete preference
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button type="submit"
                                                                    className="form-submit-button"
                                                                    onClick={handleUserPreferenceRequest}
                                                            >
                                                                Add preference
                                                            </button>
                                                        </div>
                                                    )


                                                    }


                                                </>
                                                :
                                                <> </>
                                        }
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>

                </div>

            </div>
        </div>
        </>

    );
};

