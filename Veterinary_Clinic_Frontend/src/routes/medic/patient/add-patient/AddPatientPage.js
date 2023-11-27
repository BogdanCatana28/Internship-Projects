import React, {useState, useEffect} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useLocation} from 'react-router-dom';
import {ADD_PATIENT_URL, GET_CUSTOMERS_URL} from "../../../../utils/Consts";
import RequestInstance from "../../../../utils/RequestInstance";
import PatientForm from "./PatientForm";
import TimedPopup from "../../../../components/popup/TimedPopup";

export default function AddPatientPage({patient}) {
    const location = useLocation();

    //  to preload data if form is opened from medic calendar
    const [fromAppointments, setFromAppointments] = useState(false);
    const [patientId, setPatientId] = useState(-1);
    useEffect(() => {
        location.state ? location.state.appointmentData ? setFromAppointments(location.state.appointmentData) : setFromAppointments(false) : setFromAppointments(false);
        if (location.state && location.state.appointmentData) {
            const appointmentData = location.state.appointmentData;

            initialValues.patientName = appointmentData.patientName;
            initialValues.patientType = appointmentData.patientType;
            initialValues.patientSex = appointmentData.patientSex;
            initialValues.patientBreed = appointmentData.patientBreed;
            initialValues.patientColour = appointmentData.patientColour ? appointmentData.patientColour : "";

            initialValues.ownerFirstName = appointmentData.ownerFirstName;
            initialValues.ownerLastName = appointmentData.ownerLastName;
            initialValues.ownerEmail = appointmentData.ownerEmail;
            initialValues.ownerAddress = appointmentData.ownerAddress;
            initialValues.ownerPhone = appointmentData.ownerPhone;
        }
    }, []);

    const initialValues = {
        // patient
        patientName: "",
        patientAgeYears: "",
        patientAgeMonths: "",
        patientBirthdate: "",
        patientWeight: "",
        patientType: "",
        patientSex: "",
        patientBreed: "",
        patientColour: "",
        patientMedicalHistoryBeforeClinic: "",

        // owner
        ownerFirstName: "",
        ownerLastName: "",
        ownerEmail: "",
        ownerAddress: "",
        ownerPhone: "",
        userId: "",
        userAlreadyRegistered: false,
    };


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [id, setId] = useState(-1);
    const [loadOwnerForm, setLoadOwnerForm] = useState(false);

    const validationSchema = Yup.object().shape({
        // PATIENT
        patientName: Yup.string()
            .test(
                "len",
                "The patient name must be between 3 and 20 characters.",
                (val) =>
                    val &&
                    val.toString().length >= 1 &&
                    val.toString().length <= 20
            )
            .required("This field is required!"),
        patientType: Yup.string()
            .required("This field is required!"),
        patientBreed: Yup.string()
            .required("This field is required!"),
        patientColour: Yup.string()
            .required("This field is required!"),
        patientSex: Yup.string()
            .required("This field is required!"),
        patientWeight: Yup.number()
            .test("value",
                "The weight must be between 0 and 2000",
                (val) => val >= 0 && val <= 2000)
            .required("This field is required!"),
        patientAgeYears: Yup.number(),
        patientAgeMonths: Yup.number(),
        patientBirthdate: Yup.date(),
        patientMedicalHistoryBeforeClinic: Yup.string()
            .test(
                "med-history-len",
                "Medical history must be between 0 and 10000 characters",
                (val) =>
                    !val || (
                        val.toString().length >= 0 &&
                        val.toString().length <= 10001)
            ),

        //todo make this validation work

        // OWNER
        // ownerFirstName: Yup.string()
        //     .required("This field is required!"),
        // ownerLastName: Yup.string()
        //     .required("This field is required!"),
        // ownerEmail: Yup.string()
        //     .email("This is not a valid email.")
        //     .required("This field is required!"),
        // ownerPhone: Yup.number()
        //     .required("This field is required!"),
        // ownerAddress: Yup.string()
        //     .required("This field is required!"),
    });

    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const [popupMessage, setPopupMessage] = React.useState("");
    const [successful, setSuccessful] = React.useState(false);

    const handleAddPatient = (formValue) => {
        //  patient data from form
        const {
            patientName,
            patientAgeYears,
            patientAgeMonths,
            patientBirthdate,
            patientWeight,
            patientType,
            patientSex,
            patientBreed,
            patientColour,
            patientMedicalHistoryBeforeClinic,
            userAlreadyRegistered
        } = formValue;

        RequestInstance.post(ADD_PATIENT_URL, {
            patientName,
            patientAgeYears,
            patientAgeMonths,
            patientBirthdate,
            patientWeight,
            patientType,
            patientSex,
            patientBreed,
            patientColour,
            patientMedicalHistoryBeforeClinic,
            // owner data from state
            owner: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                address: address,
                phone: phone,
                id: id
            },
            userAlreadyRegistered
        }).then(response => {
            setIsPopupVisible(true);
            setPopupMessage("Patient added successfully!");
            setSuccessful(true);
            setPatientId(response.data.id);
        }).catch(error => {
            setIsPopupVisible(true);
            if(error.response.data.message.includes("already exists")) {
                setPopupMessage("An account with this email already exists!");
            }else{
                setPopupMessage(error.response.data.message);
            }
            setSuccessful(false);
        });
    };


    // REGISTERED OWNER
    const [registered, setItRegistered] = useState(false)

    function handleClickRegistred() {
        setItRegistered(true);
        setLoadOwnerForm(false);
        fetchCustomers();
    }

    function handleClickUnregistred() {
        setItRegistered(false);

        setLoadOwnerForm(true);

        if(location.state && location.state.appointmentData) {
            const appointmentData = location.state.appointmentData;
            setFirstName(appointmentData.ownerFirstName);
            setLastName(appointmentData.ownerLastName);
            setEmail(appointmentData.ownerEmail);
            setPhone(appointmentData.ownerPhone);
            setAddress(appointmentData.ownerAddress);
            setId(appointmentData.ownerId);
        }else{
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setAddress("");
            setId(-1);
        }
        // Reinitialize owner data

        setSelectedCustomerIndex(null);
    }

    // CUSTOMERS
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    function filterCustomers(event) {
        setFilteredCustomers([]);
        let list = [];
        customers.forEach((customer) => {
            if (customer.firstName.includes(event.target.value) ||
                customer.lastName.includes(event.target.value) ||
                customer.email.includes(event.target.value)
            ) {
                list.push(customer);
            }
        });
        setFilteredCustomers(list);
    }

    const fetchCustomers = () => {
        RequestInstance.get(GET_CUSTOMERS_URL, {})
            .then((response) => response.data)
            .then(customers => {
                setCustomers(customers);
                setFilteredCustomers(customers);
            })
    }

    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(null);

    function CustomerSelected(event) {
        setLoadOwnerForm(true);
        if (event.target.value !== "") {
            setSelectedCustomerIndex(event.target.value);
        }
        const customer = filteredCustomers.at(event.target.value);
        setFirstName(customer.firstName);
        setLastName(customer.lastName);
        setEmail(customer.email);
        setPhone(customer.phone);
        setAddress(customer.address);
        setId(customer.id);
    }

    return (
        <div>
            {isPopupVisible && (
                <TimedPopup message={popupMessage} isVisible={isPopupVisible} setIsVisible={setIsPopupVisible}
                            messageType={successful ? "success" : "error"} redirect={`/medic/dashboard/patient-details/${patientId}`} timer={2000}></TimedPopup>)}
        <div className="add-patient-form-wrapper">
            <div className="component-resize-height ">
            <div className="green-patient-form-title">
                <h1 className="pt-5"><em>Patient</em> Form</h1>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleAddPatient}
            >
                {({errors, touched}) => (
                    <Form>

                            <div className="component-resize-width">

                                {/* === PATIENT ===  */}
                                <div className="add-patient-form-card">
                                    <PatientForm errors={errors} touched={touched}/>
                                </div>

                                {/* === OWNER ===  */}
                                <div className="add-patient-form-card">
                                    <div>

                                        <h3 className="green-patient-form-subtitle">Owner</h3>

                                        {/* == REGISTERED == */}
                                        <div>
                                            <label className="green-patient-form-subtitle"
                                                   htmlFor="userAlreadyRegistered">Registered</label>
                                            <div>
                                                <div className="add-patient-form-registered-group">
                                                    <label>
                                                        <Field type="radio" name="userAlreadyRegistered"
                                                               value="true"
                                                               onClick={handleClickRegistred}/>
                                                        Yes ( link already existing account )
                                                    </label>
                                                </div>
                                                <div className="add-patient-form-registered-group">
                                                    <label>
                                                        <Field type="radio" name="userAlreadyRegistered"
                                                               value="false"
                                                               onClick={handleClickUnregistred}/>
                                                        No ( make new account )
                                                    </label>
                                                </div>

                                                <div>
                                                    {errors.userAlreadyRegistered && touched.userAlreadyRegistered ?
                                                        <ErrorMessage
                                                            name="userAlreadyRegistered"
                                                            component="div"
                                                            className="input-error-message"
                                                        /> :
                                                        // Used to take space on the page when there is no error
                                                        <span className="hidden-error-message">Error</span>}
                                                </div>
                                            </div>

                                            {/* == REGISTERED YES -> FIND ACCOUNT == */}
                                            {registered ?
                                                <div>
                                                    <div className="add-patient-form-group">
                                                        <label className="add-patient-form-label" htmlFor="account">Search
                                                            account</label>
                                                        <Field
                                                            name="account"
                                                            type="text"
                                                            onChange={filterCustomers}
                                                        />
                                                        <div>
                                                            {/*Used to take space on the page when there is no error*/}
                                                            <span className="hidden-error-message">Error</span>
                                                        </div>
                                                    </div>

                                                    <div className="add-patient-form-group">
                                                        <Field
                                                            name="userId"
                                                            type="text"
                                                            as="select"
                                                            size="5"
                                                            onChange={CustomerSelected}
                                                            value={(selectedCustomerIndex ? selectedCustomerIndex : "")}
                                                        >
                                                            <option value="" key="-1"
                                                                    className="select-user-option-header">
                                                                Select a user:
                                                            </option>
                                                            {
                                                                filteredCustomers.map((customer, index) => {
                                                                    return <option className="add-patient-form-option"
                                                                                   key={index}
                                                                                   value={index}>
                                                                        <div>
                                                                            {customer.firstName + " " +
                                                                                customer.lastName + " " +
                                                                                customer.email}
                                                                        </div>
                                                                    </option>
                                                                })
                                                            }

                                                        </Field>
                                                        <div>
                                                            {errors.userId && touched.userId ?
                                                                <ErrorMessage
                                                                    name="userId"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                ""
                                            }


                                            {/* == REGISTERED NO -> CREATE ACCOUNT == */}
                                            {loadOwnerForm ?
                                                <div>

                                                    {/* == FIRST NAME == */}
                                                    <div className="add-patient-form-group">
                                                        <label className="add-patient-form-label"
                                                               htmlFor="ownerFirstName">First name</label>
                                                        <Field
                                                            name="ownerFirstName"
                                                            type="text"
                                                            className={(errors.ownerFirstName && touched.ownerFirstName ? " red-error-message" : "")}
                                                            placeholder="John"
                                                            value={firstName}
                                                            onChange={(event) => {
                                                                setFirstName(event.target.value)
                                                            }}
                                                        />
                                                        <div>
                                                            {errors.ownerFirstName && touched.ownerFirstName ?
                                                                <ErrorMessage
                                                                    name="ownerFirstName"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span
                                                                    className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    {/* == LAST NAME == */}
                                                    <div className="add-patient-form-group">
                                                        <label className="add-patient-form-label"
                                                               htmlFor="ownerLastName">Last name</label>
                                                        <Field
                                                            name="ownerLastName"
                                                            type="text"
                                                            className={(errors.ownerLastName && touched.ownerLastName ? " red-error-message" : "")}
                                                            placeholder="Doe"
                                                            value={lastName}
                                                            onChange={(event) => {
                                                                setLastName(event.target.value)
                                                            }}
                                                        />
                                                        <div>
                                                            {errors.ownerLastName && touched.ownerLastName ?
                                                                <ErrorMessage
                                                                    name="ownerLastName"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span
                                                                    className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>


                                                    {/* == EMAIL == */}
                                                    <div className="add-patient-form-group">
                                                        <label className="add-patient-form-label"
                                                               htmlFor="ownerEmail">Email</label>
                                                        <Field
                                                            name="ownerEmail"
                                                            type="email"
                                                            className={(errors.ownerEmail && touched.ownerEmail ? " red-error-message" : "")}
                                                            placeholder="johieboi@email.com"
                                                            value={email}
                                                            onChange={(event) => {
                                                                setEmail(event.target.value)
                                                            }}
                                                        />
                                                        <div>
                                                            {errors.ownerEmail && touched.ownerEmail ?
                                                                <ErrorMessage
                                                                    name="ownerEmail"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    {/* == PHONE == */}
                                                    <div className="add-patient-form-group">
                                                        <label className="add-patient-form-label"
                                                               htmlFor="ownerPhone">Phone</label>
                                                        <Field
                                                            name="ownerPhone"
                                                            type="text"
                                                            className={(errors.ownerPhone && touched.ownerPhone ? " red-error-message" : "")}
                                                            placeholder="0799999999"
                                                            value={phone}
                                                            onChange={(event) => {
                                                                setPhone(event.target.value)
                                                            }}
                                                        />
                                                        <div>
                                                            {errors.ownerPhone && touched.ownerPhone ?
                                                                <ErrorMessage
                                                                    name="ownerPhone"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span
                                                                    className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                    {/* == ADDRESS == */}
                                                    <div className="add-patient-form-group">
                                                        <label className="add-patient-form-label"
                                                               htmlFor="ownerAddress">Address</label>
                                                        <Field
                                                            name="ownerAddress"
                                                            type="text"
                                                            className={(errors.ownerAddress && touched.ownerAddress ? " red-error-message" : "")}
                                                            placeholder="25th Rudolph Street, Santa Land"
                                                            value={address}
                                                            onChange={(event) => {
                                                                setAddress(event.target.value)
                                                            }}
                                                        />
                                                        <div>
                                                            {errors.ownerAddress && touched.ownerAddress ?
                                                                <ErrorMessage
                                                                    name="ownerAddress"
                                                                    component="div"
                                                                    className="input-error-message"
                                                                /> :
                                                                // Used to take space on the page when there is no error
                                                                <span className="hidden-error-message">Error</span>}
                                                        </div>
                                                    </div>

                                                </div>
                                                : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* === SUBMIT BUTTON ===  */}
                            <div>
                                <button type="submit" className="add-patient-form-submit-button">
                                    Add patient
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
        </div>
    );
};