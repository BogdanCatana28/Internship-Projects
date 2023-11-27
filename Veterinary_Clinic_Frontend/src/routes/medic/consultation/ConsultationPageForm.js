import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Formik, Field, Form, ErrorMessage, useField} from "formik";
import * as Yup from "yup";
import {ADD_CONSULTATION_URL} from "../../../utils/Consts";
import RequestInstance from "../../../utils/RequestInstance";
import PatientForm from "./PatientForm";
import OwnerForm from "./OwnerForm";
import ConsultationForm from "./ConsultationForm";
import "./AddConsultationPage.css"
import {useNavigate} from 'react-router-dom';
import moment from "moment";
import TimedPopup from "../../../components/popup/TimedPopup";
//remove the imports that what you don't use.
export default function ConsultationPageForm({preloadedData}) {
    const initialValues = {
        // patient
        patientId: preloadedData.id,
        patientName: preloadedData.patientName,
        patientBirthdate: preloadedData.patientBirthdate,
        patientWeight: preloadedData.patientWeight,
        patientType: preloadedData.patientType,
        patientSex: preloadedData.patientSex,
        patientBreed: preloadedData.patientBreed,
        patientColour: preloadedData.patientColour,

        // owner
        ownerFirstName: preloadedData.owner.firstName,
        ownerLastName: preloadedData.owner.lastName,
        ownerEmail: preloadedData.owner.email,
        ownerAddress: preloadedData.owner.address,
        ownerPhone: preloadedData.owner.phone,

        //consultation
        consultationMainConcern: "",
        consultationHistoryOfConcern: "",
        consultationDiagnostic: "",
        consultationTreatment: "",
        consultationExtraNotes: "",
    };

    const [submitting, setSubmitting] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupMessageType, setPopupMessageType] = useState("");
    function checkNumber(string) {
        if (!isNaN(string) && string.toString().indexOf('.') !== -1)
            return true;
        return /^[0-9]*$/.test(string);
    }
    const handleAddConsultation = (formValue) => {
        const {
            //patient
            patientId,
            patientName,
            patientBirthdate,
            patientWeight,
            patientType,
            patientSex,
            patientBreed,
            patientColour,
            // owner
            ownerFirstName,
            ownerLastName,
            ownerEmail,
            ownerAddress,
            ownerPhone,
            //consultation
            consultationMainConcern,
            consultationHistoryOfConcern,
            consultationDiagnostic,
            consultationTreatment,
            consultationExtraNotes
        } = formValue;

        if(!checkNumber(patientWeight)){
            setIsPopupVisible(true);
            setPopupMessage("Weight must be a number!");
            setPopupMessageType("error");
            return;
        }

        RequestInstance.post(ADD_CONSULTATION_URL, {
            //patient
            patientId,
            patientName,
            patientBirthDate:patientBirthdate,
            patientWeight,
            patientType,
            patientSex,
            patientBreed,
            patientColor:patientColour,
            // owner
            ownerFirstName,
            ownerLastName,
            ownerEmail,
            ownerAddress,
            ownerPhone,
            //consultation
            consultationMainConcern,
            consultationHistoryOfConcern,
            consultationDiagnostic,
            consultationTreatment,
            consultationExtraNotes,
            consultationCreationDate: moment(Date.now()).toDate(),
        }).then(r => {
            setIsPopupVisible(true);
            setPopupMessage("Consultation added successfully! Redirecting...");
            setPopupMessageType("success");
            setSubmitting(false);
        }).catch(error => {
            setIsPopupVisible(true);
            setPopupMessage(error.response.data.message);
            setPopupMessageType("error");
            setSubmitting(false);
        });
    };

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
        patientWeight: Yup.string()
            .test("value",
                "The weight must be between 0 and 2000",
                (val) => val >= 0 && val <= 2000)
            .required("This field is required!"),
        patientAgeYears: Yup.number(),
        patientAgeMonths: Yup.number(),
        patientBirthdate: Yup.date(), // verify not future?
        patientMedicalHistoryBeforeClinic: Yup.string()
            .test(
                "med-history-len",
                "Medical history must be between 0 and 10000 characters",
                (val) =>
                    !val || (
                        val.toString().length >= 0 &&
                        val.toString().length <= 10001)
            ),

        // OWNER
        ownerFirstName: Yup.string()
            .required("This field is required!"),
        ownerLastName: Yup.string()
            .required("This field is required!"),
        ownerEmail: Yup.string()
            .email("This is not a valid email.")
            .required("This field is required!"),
        ownerPhone: Yup.string()
            .required("This field is required!"),
        ownerAddress: Yup.string()
            .required("This field is required!"),

        // CONSULTATION
        consultationMainConcern: Yup.string()
            .required("This field is required!"),
    });

    return (
        <div>
            {isPopupVisible &&
                <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                            setIsVisible={setIsPopupVisible} redirect={`/medic/dashboard/patient-details/${initialValues.patientId}`} timer={2000}></TimedPopup>}
            <div className="add-consultation-form-wrapper">
            <div className="consultation-form">
                <div className="consulation-form-title">
                    <h1 className="pt-5"><em>Consultation</em> Form</h1>
                </div>
                <div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleAddConsultation}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <div>
                                    <div className="consultation-form-resize">
                                        <PatientForm errors={errors} touched={touched}/>
                                        <OwnerForm errors={errors} touched={touched}/>
                                        <ConsultationForm errors={errors} touched={touched}/>
                                    </div>
                                </div>

                                <div className="consulation-form-group">
                                    <button type="submit" className="consulation-form-submit-button">
                                        {submitting ? "Adding consultation..." : "Add consultation"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
        </div>
    );
}
