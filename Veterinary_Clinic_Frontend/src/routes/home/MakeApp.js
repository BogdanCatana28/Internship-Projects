import React, { useState } from "react";
import './MakeApp.css';
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import StepperModal from "../appointment/StepperModal";

const MakeApp = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const closeMobileMenu = () => setClick(false);
    const [click, setClick] = useState(false);

    return (
        <>
        <div className="app-two-column-container">
            <div className="app-right-column">
                <h1 className="app-custom-heading">Schedule an Appointment</h1>
                <h2 className="app-custom-heading">It's that simple!</h2>
                <p className="app-custom-paragraph">
                    We are happy to help you book your appointment efficiently so we can provide the service you deserve!
                </p>
                <p className="app-custom-paragraph">
                    If your pet is experiencing any signs of illness or injury, please call us at +40 789 123 456 for the first available appointment.

                    For routine wellness visits such as vaccines, rechecks, and routine lab work, please request an appointment below.
                </p>
                <Link to="#" className="secondary-button" onClick={() => { setModalOpen(true); closeMobileMenu(); }}>
                    Schedule yours now <FiArrowRight />{" "}
                </Link>
            </div>
            <div className="app-left-column">
                <img src="./images/photo1.png" alt="Your Image" />
            </div>
        </div>
        {modalOpen && <StepperModal setOpenModal={setModalOpen} />}
        </>
    );
};

export default MakeApp;