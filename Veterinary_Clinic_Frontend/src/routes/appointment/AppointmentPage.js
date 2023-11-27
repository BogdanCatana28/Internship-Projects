import React, { useState } from "react";
import "./Appointment.css";
import ServiceModal from "./StepperModal";

function AppointmentPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="Appointment">
      <h1>Welcome to our Appointment Section</h1>
      <button
        className="openModalBtn"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Make an Appointment
      </button>

      {modalOpen && <ServiceModal setOpenModal={setModalOpen} />}
    </div>
  );
}

export default AppointmentPage;

//A good practice it's to use same name for Js and css file.