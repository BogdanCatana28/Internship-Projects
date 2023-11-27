import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from "yup";
import {registerMedic} from "../../../slices/Auth";
import message, {clearMessage} from "../../../slices/Message";
import "./RegisterMedic.css"
import TimedPopup from "../../../components/popup/TimedPopup";
import api from "../../../services/Api";

const RegisterMedic = () => {
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
        password: "",
        specializations: [],
        education: "",
        experience: "",
    };

    const medicSpecializations = ["SURGERY", "DENTISTRY", "ANESTHESIOLOGY", "PATHOLOGIST", "SMALL_ANIMAL"];

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val) =>
                    val &&
                    val.toString().length >= 3 &&
                    val.toString().length <= 20
            )
            .required("This field is required!"),
        lastName: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val) =>
                    val &&
                    val.toString().length >= 3 &&
                    val.toString().length <= 20
            )
            .required("This field is required!"),
        email: Yup.string()
            .email("This is not a valid email.")
            .required("This field is required!"),
        phone: Yup.string()
            .matches(/^0(2|7)[0-9]+$/, "This is not a valid phone number.")
            .required("This field is required!"),
        address: Yup.string().required("This field is required!"),
        password: Yup.string()
            .test(
                "len",
                "The password must have at least 8 characters",
                (val) =>
                    val &&
                    val.toString().length >= 8
            )
            .required("This field is required!"),

        specializations: Yup.array()
            .min(1, "At least one specialization is required.")
            .required("This field is required."),

        education: Yup.string().required("This field is required."),
        experience: Yup.string().required("This field is required."),

    });

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupMessageType, setPopupMessageType] = useState("");


    const registerMedic = ({firstName, lastName, email, address, phone, password, education, specializations, experience}) => {
        return api.post("/auth/sign-up/medic", {
            firstName,
            lastName,
            email,
            address,
            phone,
            password,
            education,
            specializations,
            experience,
        });
    };


    const handleFormSubmit = (formValues) => {
        setSubmitting(true);
        registerMedic(formValues)
            .then((response) => {
                setSubmitting(false);
                setIsPopupVisible(true);
                setPopupMessage("Medic added successfully! Redirecting...");
                setPopupMessageType("success");
            })
            .catch((error) => {
                setSubmitting(false);
                setIsPopupVisible(true);
                console.log(error.response.data.message)
                setPopupMessage(error.response.data.message);
                setPopupMessageType("error");
            });
    };


    return (
        <>
            {isPopupVisible &&
                <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                            setIsVisible={setIsPopupVisible} timer={2000} redirect={`/admin/dashboard/medics`}></TimedPopup>}
            <div className="add-medic-form-center">
                <div className="add-medic-component-resize-height">
                    <div className="add-medic-form-title">
                        <h1><em>Medic</em> Form</h1>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <div className=" add-medic-form-card-background add-medic-component-resize-width">

                                    <div className="add-medic-form-card">
                                        <div className="add-medic-form-group">
                                            <label className="add-medic-form-label" htmlFor="firstName">First Name</label>
                                            <Field name="firstName" type="text"
                                                   className={(errors.firstName && touched.firstName ? " red-error-message" : "")}
                                                   placeholder="Andrew"
                                            />
                                            <div>
                                                {errors.ownerAddress && touched.ownerAddress ?
                                                    <ErrorMessage
                                                        name="firstName"
                                                        component="div"
                                                        className="input-error-message"
                                                    /> :
                                                    // Used to take space on the page when there is no error
                                                    <span className="hidden-error-message">Error</span>}
                                            </div>
                                        </div>
                                        <div className="add-medic-form-group">
                                            <label  className="add-medic-form-label" htmlFor="lastName">Last Name</label>
                                            <Field name="lastName" type="text"
                                                   className={(errors.lastName && touched.lastName ? " red-error-message" : "")}
                                                   placeholder="Smith"
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
                                        <div className="add-medic-form-group">
                                            <label  className="add-medic-form-label" htmlFor="email">Email</label>
                                            <Field name="email" type="email"
                                                   className={(errors.email && touched.email ? " red-error-message" : "")}
                                                   placeholder="andyy@gmail.com"
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

                                        <div className="add-medic-form-group">
                                            <label className="add-medic-form-label"  htmlFor="password">Password</label>
                                            <Field name="password" type="password"
                                                   className={(errors.password && touched.password ? " red-error-message" : "")}
                                                   placeholder="********"
                                            />
                                            <div>
                                                {errors.password && touched.password ?
                                                    <ErrorMessage
                                                        name="password"
                                                        component="div"
                                                        className="input-error-message"
                                                    /> :
                                                    // Used to take space on the page when there is no error
                                                    <span className="hidden-error-message">Error</span>}
                                            </div>
                                        </div>

                                        <div className="add-medic-form-group">
                                            <label className="add-medic-form-label"  htmlFor="address">Address</label>
                                            <Field name="address" type="text"
                                                   className={(errors.address && touched.address ? " red-error-message" : "")}
                                                   placeholder="Str. Mihai Eminescu, nr. 1"
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


                                    </div>

                                    <div className="add-medic-form-card">

                                        <div className="add-medic-form-group">
                                            <label  className="add-medic-form-label" htmlFor="phone">Phone</label>
                                            <Field name="phone" type="text"
                                                   className={(errors.phone && touched.phone ? " red-error-message" : "")}
                                                   placeholder="0740123456"
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


                                        <div className="add-medic-form-group">
                                            <label className="add-medic-form-label"  htmlFor="education">Education</label>
                                            <Field name="education" type="text"
                                                   className={(errors.education && touched.education ? " red-error-message" : "")}
                                                   placeholder="Faculty of Veterinary Medicine, Cluj"
                                            />
                                            <div>
                                                {errors.education && touched.education ?
                                                    <ErrorMessage
                                                        name="education"
                                                        component="div"
                                                        className="input-error-message"
                                                    /> :
                                                    // Used to take space on the page when there is no error
                                                    <span className="hidden-error-message">Error</span>}
                                            </div>
                                        </div>
                                        <div className="add-medic-form-group">
                                            <label  className="add-medic-form-label" htmlFor="experience">Experience</label>
                                            <Field name="experience" type="text"
                                                   className={(errors.experience && touched.experience ? " red-error-message" : "")}
                                                   placeholder="Golden dog clinic, 5 years"
                                            />
                                            <div>
                                                {errors.experience && touched.experience ?
                                                    <ErrorMessage
                                                        name="experience"
                                                        component="div"
                                                        className="input-error-message"
                                                    /> :
                                                    // Used to take space on the page when there is no error
                                                    <span className="hidden-error-message">Error</span>}
                                            </div>
                                        </div>

                                        <div className="add-medic-form-group">
                                            <label  className="add-medic-form-label" htmlFor="specializations">Specialization</label>
                                            {medicSpecializations.map((specializations) => (
                                                <div key={specializations}>
                                                    <label className="add-medic-padding-item add-medic-form-specialization-label">
                                                        <Field
                                                            type="checkbox"
                                                            name="specializations"
                                                            value={specializations}
                                                        />
                                                        {specializations}
                                                    </label>
                                                </div>
                                            ))}
                                            <div>
                                                {errors.specializations && touched.specializations ?
                                                    <ErrorMessage
                                                        name="specializations"
                                                        component="div"
                                                        className="input-error-message"
                                                    /> :
                                                    // Used to take space on the page when there is no error
                                                    <span className="hidden-error-message">Error</span>}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="add-medic-form-submit-button"
                                        disabled={submitting}
                                    >
                                        {submitting ? "Adding medic..." : "Add medic"}
                                    </button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default RegisterMedic;
