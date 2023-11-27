import React from "react";
import {Field, ErrorMessage} from "formik";
import "./AddConsultationPage.css"

export default function ConsultationForm({preloadedData, errors, touched}) {

    return (
        <div className="consulation-form-card">
            {/******************** CONSULTATION **********************/}
            <div>
                <h3 className="consulation-form-subtitle">Consultation</h3>

                <div>
                    <div className="consulation-form-group  ">
                        <label className="consulation-form-label"  htmlFor="consultationMainConcern">Main concern</label>
                        <Field
                            name="consultationMainConcern"
                            type="text"
                            as="textarea"
                            className={  
                                (errors.consultationMainConcern && touched.consultationMainConcern ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.consultationMainConcern && touched.consultationMainConcern?
                                <ErrorMessage
                                    name="consultationMainConcern"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="consulation-form-group  ">
                        <label  className="consulation-form-label" htmlFor="consultationHistoryOfConcern">History of concern</label>
                        <Field
                            name="consultationHistoryOfConcern"
                            type="text"
                            as="textarea"
                            className={  
                                (errors.consultationHistoryOfConcern && touched.consultationHistoryOfConcern ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.consultationHistoryOfConcern && touched.consultationHistoryOfConcern?
                                <ErrorMessage
                                    name="consultationHistoryOfConcern"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="consulation-form-group  ">
                        <label className="consulation-form-label"  htmlFor="consultationDiagnostic">Diagnostic</label>
                        <Field
                            name="consultationDiagnostic"
                            type="text"
                            as="textarea"
                            className={  
                                (errors.consultationDiagnostic && touched.consultationDiagnostic ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.consultationDiagnostic && touched.consultationDiagnostic?
                                <ErrorMessage
                                    name="consultationDiagnostic"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="consulation-form-group  ">
                        <label className="consulation-form-label"  htmlFor="consultationTreatment">Treatment</label>
                        <Field
                            name="consultationTreatment"
                            type="text"
                            as="textarea"
                            className={  
                                (errors.consultationTreatment && touched.consultationTreatment ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.consultationTreatment && touched.consultationTreatment?
                                <ErrorMessage
                                    name="consultationTreatment"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="consulation-form-group  ">
                        <label className="consulation-form-label"  htmlFor="consultationExtraNotes">Extra notes</label>
                        <Field
                            name="consultationExtraNotes"
                            type="text"
                            as="textarea"
                            className={  
                                (errors.consultationExtraNotes && touched.consultationExtraNotes ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.consultationExtraNotes && touched.consultationExtraNotes?
                                <ErrorMessage
                                    name="consultationExtraNotes"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}