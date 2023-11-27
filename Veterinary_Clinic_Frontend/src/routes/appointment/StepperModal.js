import React from 'react';
import Stepper from './Stepper';
import "./StepperModal.css";

export default function StepperModal({ setOpenModal }) {
  return (
    <div className="stepperModalBackground">
      <div className="stepperModalContainer">
        <div className="stepperModalTitleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="stepperModalBody">
          <Stepper />
        </div>
        <div className="stepperModalFooter">
        </div>
      </div>
    </div>
  );
}
