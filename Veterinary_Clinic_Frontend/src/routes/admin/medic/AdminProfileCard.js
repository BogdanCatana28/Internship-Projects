import React from "react";
import "../../medics/ProfileCard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faUserGraduate, faCertificate, faBriefcase } from '@fortawesome/free-solid-svg-icons';

function ProfileCard(props) {

  const formattedSpecializations = Array.isArray(props.specializations)
    ? props.specializations.join(', ')
    : props.specializations;

  return (
    <div className="medic-card-container">
      <header className="medic-header-admin">
        <img src={props.photo} alt={`${props.firstName} ${props.lastName}`} className="medic-img" />
      </header>
      <h1 className="medic-bold-text">
        {`${props.firstName} ${props.lastName}`}
      </h1>
      <h2 className="medic-normal-text">
        <span className="medic-label"><FontAwesomeIcon icon={faCertificate} /> Specializations:</span> {formattedSpecializations}
      </h2>
      <h2 className="medic-normal-text">
        <span className="medic-label"><FontAwesomeIcon icon={faUserGraduate} />  Education:</span> {props.education}
      </h2>
      <h2 className="medic-normal-text">
        <span className="medic-label"><FontAwesomeIcon icon={faBriefcase} />  Experience:</span> {props.experience}
      </h2>
      <div className="medic-social-container">
        <div className="medic-phone">
          <h1 className="medic-bold-text">{props.phone}</h1>
          <h2 className="medic-smaller-text"><FontAwesomeIcon icon={faPhone} />  Phone</h2>
        </div>
        <div className="medic-email">
          <h1 className="medic-bold-text">{props.email}</h1>
          <h2 className="medic-smaller-text"><FontAwesomeIcon icon={faEnvelope} />  Email</h2>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
