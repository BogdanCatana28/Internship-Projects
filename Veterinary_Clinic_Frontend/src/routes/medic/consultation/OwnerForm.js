import React from "react";
import {Field, ErrorMessage} from "formik";
import "./AddConsultationPage.css"

export function OwnerForm ({errors, touched}) {

    return (
        <div className="consulation-form-card">
            {/***************** OWNER ********************/}
            <div>
                <h3 className="consulation-form-subtitle">Owner</h3>

                <div>
                    <div className="   consulation-form-group ">
                        <label className="consulation-form-label"  htmlFor="ownerFirstName">First Name</label>
                        <Field
                            name="ownerFirstName"
                            type="text"
                            disabled={true}
                            className={  
                                (errors.ownerFirstName && touched.ownerFirstName ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.ownerFirstName && touched.ownerFirstName?
                                <ErrorMessage
                                    name="ownerFirstName"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="   consulation-form-group ">
                        <label className="consulation-form-label"  htmlFor="ownerLastName">Last Name</label>
                        <Field
                            name="ownerLastName"
                            type="text"
                            disabled={true}
                            className={  
                                (errors.ownerLastName && touched.ownerLastName ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.ownerLastName && touched.ownerLastName?
                                <ErrorMessage
                                    name="ownerLastName"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="   consulation-form-group ">
                        <label  className="consulation-form-label" htmlFor="ownerEmail">Email</label>
                        <Field
                            name="ownerEmail"
                            type="email"
                            disabled={true}
                            className={  
                                (errors.ownerEmail && touched.ownerEmail ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.ownerEmail && touched.ownerEmail?
                                <ErrorMessage
                                    name="ownerEmail"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="   consulation-form-group ">
                        <label className="consulation-form-label"  htmlFor="ownerPhone">Phone</label>
                        <Field
                            name="ownerPhone"
                            type="text"
                            className={  
                                (errors.ownerPhone && touched.ownerPhone ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.ownerPhone && touched.ownerPhone?
                                <ErrorMessage
                                    name="ownerPhone"
                                    component="div"
                                    className="input-error-message"
                                /> :
                                // Used to take space on the page when there is no error
                                <span className="hidden-error-message">Error</span>}
                        </div>
                    </div>

                    <div className="   consulation-form-group ">
                        <label className="consulation-form-label"  htmlFor="ownerAddress">Address</label>
                        <Field
                            name="ownerAddress"
                            type="text"
                            className={  
                                (errors.ownerAddress && touched.ownerAddress ? " red-error-message" : "")
                            }
                        />
                        <div>
                            {errors.ownerAddress && touched.ownerAddress?
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
            </div>
        </div>
    );
};

export default OwnerForm;