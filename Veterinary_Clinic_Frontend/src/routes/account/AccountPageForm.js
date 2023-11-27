import React, {useState} from "react";
import "./AccountPage.css"
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import TokenService from "../../services/TokenService";
import Avatar from "./Avatar";
import {useNavigate} from 'react-router-dom';
import {USER_URL} from "../../utils/Consts";
import RequestInstance from "../../utils/RequestInstance";
import Popup from "../../components/popup/Popup"
import TimedPopup from "../../components/popup/TimedPopup";

export function AccountPageForm({preloadedData}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupMessageType, setPopupMessageType] = useState("");
    const user = TokenService.getUser();

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required("This field is required!"),
        newPassword1: Yup.string()
            .test(
                "len",
                "The password must have at least 8 characters.",
                (val) =>
                    val &&
                    val.toString().length >= 8
            )
            .required("This field is required!"),
        newPassword2: Yup.string()
            .test(
                "len",
                "The password must have at least 8 characters",
                (val) =>
                    val &&
                    val.toString().length >= 8
            )
            .test(
                "match",
                "Passwords do not match",
                function (value) {
                    return this.parent.newPassword1 === value;
                }
            )
            .required("This field is required!"),
    });

    const handleUpdateAccountInformation = (formValue) => {
        console.log("updating..")
        const {
            firstName,
            lastName,
            address,
            phone,
            email,
            newPassword1,
            currentPassword
        } = formValue;

        RequestInstance.post(USER_URL, {
            id: user.id,
            firstName,
            lastName,
            address,
            phone,
            email,
            newPassword: newPassword1,
            currentPassword
        }).then(r => {
            setIsPopupVisible(true);
            setPopupMessage("Password changed successfully!");
            setPopupMessageType("success");
        }).catch(error => {
            setIsPopupVisible(true);
            setPopupMessage(error.response.data.message);
            setPopupMessageType("error");
        });
    };

    const initialValues = {
        firstName: preloadedData.firstName,
        lastName: preloadedData.lastName,
        address: preloadedData.address,
        phone: preloadedData.phone,
        email: preloadedData.email,
        newPassword1: "",
        newPassword2: "",
        currentPassword: "",
    };

    const [avatarChanged, setAvatarChanged] = useState(false);
    const handleAvatarChange = (image) => {
        setSelectedFile(image);
        setAvatarChanged(true);
    };

    const handleSaveAvatar = () => {
        const formData = new FormData();
        const user = TokenService.getUser();
        formData.append('file', selectedFile);

        fetch(`http://localhost:8080/users/${user.id}/avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${preloadedData.Authorization}`,
            },
            body: formData,
        }).then(r => {
                setIsPopupVisible(true);
                setPopupMessage("Avatar changed successfully!");
                setPopupMessageType("success");
            }).catch(error => {
            setIsPopupVisible(true);
            setPopupMessage(error.response.data.message);
            setPopupMessageType("error");
        });

        setAvatarChanged(false);
    };

    const navigate = useNavigate();

    const navigateToPreferences = () => {
        navigate(`/preferences`);
    }

    return (
        <>
            {isPopupVisible &&
                <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                            setIsVisible={setIsPopupVisible}></TimedPopup>}
        <div className="account-page big-form-component-resize">

            {/* NAVIGATION BUTTONS */}
            <div className="routing-buttons">
                <button role="button" className="account-navigation-button account-button">Account</button>
                <button role="button" className="account-navigation-button" onClick={navigateToPreferences}>
                    Preferences
                </button>
            </div>

            <div className=" card card-container mb-5 green-form ">
                {/* AVATAR */}
                <Avatar onAvatarChange={handleAvatarChange}/>
                {avatarChanged &&
                    <button type="submit" className="form-submit-button" onClick={handleSaveAvatar}>
                        Update avatar
                    </button>
                }
                {/* FORM INFORMATION */}
                <div className="extra-info">
                    <p>Select the image to update profile picture</p>
                    <p>Modify your password below</p>
                </div>

                {/* ACCOUNT INFORMATION */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateAccountInformation}
                >
                    {({errors, touched}) => (
                        <Form>
                            <div>
                                <label htmlFor="firstName" className="field-label">First Name</label>
                                <Field name="firstName" type="text"
                                       className={(errors.firstName && touched.firstName ? " red-error-message" : "")}
                                       disabled={true}
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
                                <label htmlFor="lastName" className="field-label">Last Name</label>
                                <Field name="lastName" type="text"
                                       className={(errors.lastName && touched.lastName ? " red-error-message" : "")}
                                       disabled={true}
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
                                    className={(errors.email && touched.email ? " red-error-message" : "")}
                                    disabled={true}
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
                                <label htmlFor="address" className="field-label">Address</label>
                                <Field
                                    name="address"
                                    type="text"
                                    className={"form-control" +
                                        (errors.address && touched.address ? " red-error-message" : "")
                                    }
                                    disabled={true}
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
                                    disabled={true}
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
                                <label htmlFor="currentPassword" className="field-label">Insert current
                                    password</label>
                                <Field
                                    name="currentPassword"
                                    type="password"
                                    className={(errors.currentPassword && touched.currentPassword ? " red-error-message" : "")}
                                />
                                <div>
                                    {errors.currentPassword && touched.currentPassword ?
                                        <ErrorMessage
                                            name="currentPassword"
                                            component="div"
                                            className="input-error-message"
                                        /> :
                                        // Used to take space on the page when there is no error
                                        <span className="hidden-error-message">Error</span>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="newPassword1" className="field-label">Insert new password</label>
                                <Field
                                    name="newPassword1"
                                    type="password"
                                    className={(errors.newPassword1 && touched.newPassword1 ? " red-error-message" : "")}
                                />
                                <div>
                                    {errors.newPassword1 && touched.newPassword1 ?
                                        <ErrorMessage
                                            name="newPassword1"
                                            component="div"
                                            className="input-error-message"
                                        /> :
                                        // Used to take space on the page when there is no error
                                        <span className="hidden-error-message">Error</span>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="newPassword2" className="field-label">Reintroduce new
                                    password</label>
                                <Field
                                    name="newPassword2"
                                    type="password"
                                    className={(errors.newPassword2 && touched.newPassword2 ? " red-error-message" : "")}
                                />
                                <div>
                                    {errors.newPassword2 && touched.newPassword2 ?
                                        <ErrorMessage
                                        name="newPassword2"
                                        component="div"
                                        className="input-error-message"
                                    /> :
                                        // Used to take space on the page when there is no error
                                        <span className="hidden-error-message">Error</span>}
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="form-submit-button">
                                    Update password
                                </button>
                            </div>
                    </Form>)}
                </Formik>
            </div>
        </div>
        </>
    );
};