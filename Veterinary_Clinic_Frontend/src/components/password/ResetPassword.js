import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/Api";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./ResetPassword.css";
import TimedPopup from "../popup/TimedPopup";

const ResetPassword = () => {
  const { token } = useParams(); 
  const [resetSuccess, setResetSuccess] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) =>
          val &&
          val.toString().length >= 6 &&
          val.toString().length <= 40
      )
      .required("This field is required!"),
    reenterPassword: Yup.string() 
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("This field is required!"),
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupMessageType, setPopupMessageType] = useState("");

  const handleSubmit = (values) => {
    
    const { password } = values;
    axiosInstance
      .post("/auth/reset-password", { token, password })
      .then(() => {
        setResetSuccess(true);
        setIsPopupVisible(true);
        setPopupMessage("Password reset successfully!");
        setPopupMessageType("success");
      })
      .catch((error) => {
        setIsPopupVisible(true);
        setPopupMessage(error.response.data.message);
        setPopupMessageType("error");
        console.error("Error resetting password:", error);
      });
  };

  useEffect(() => {
    
  }, [token]);

  return (
    <>
      {isPopupVisible &&
        <TimedPopup message={popupMessage} isVisible={isPopupVisible} messageType={popupMessageType}
                    setIsVisible={setIsPopupVisible} timer={2000} redirect={`/login`}></TimedPopup>}
   <div className="background-wrapper-reset">
      <div className="container-login right-panel-active" id="container">
        <div className="form-container sign-in-container">
          <Formik
            initialValues={{ password: "", reenterPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="form-login">
                {resetSuccess ? (
                  <div>
                    <h2>Password Reset Successful</h2>
                    <p>Your password has been successfully reset.</p>
                  </div>
                ) : (
                  <div>
                    <h2>Reset Password</h2>
                    <Field
                      type="password"
                      name="password"
                      placeholder="New Password"
                      className={
                        "form-control-reset custom-input" +
                        (errors.password && touched.password ? " is-invalid" : "")
                      }
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />

                  
                    <Field
                      type="password"
                      name="reenterPassword"
                      placeholder="Re-enter Password"
                      className={
                        "form-control-reset custom-input" +
                        (errors.reenterPassword && touched.reenterPassword
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="reenterPassword"
                      component="div"
                      className="invalid-feedback"
                    />

                    <button
                      type="submit"
                      className="custom-button-reset"
                      disabled={
                        Object.keys(errors).length > 0
                      }
                    >
                      Reset Password
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
        <div class="overlay-container">
              <div class="overlay-ResetPassword">
                  {/* <div class="overlay-panel overlay-right">
                      
                  </div> */}
              </div>
          </div>
      </div>
    </div>
    </>
  );
};

export default ResetPassword;
