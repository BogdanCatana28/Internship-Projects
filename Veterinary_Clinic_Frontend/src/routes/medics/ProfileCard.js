import React from "react";
import "./ProfileCard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faUserGraduate, faCertificate, faBriefcase } from '@fortawesome/free-solid-svg-icons';

function ProfileCard(props) {


    function randomizeNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const [randomBackground, setRandomBackground] = React.useState("medic-header-background-" + randomizeNumber(1, 4));


  const formattedSpecializations = Array.isArray(props.specializations)
    ? props.specializations.join(', ')
    : props.specializations;

  return (
    <div className="medic-card-container">
      <header className={"medic-header " + randomBackground}>
        <img src={props.photo} alt={`${props.firstName} ${props.lastName}`} className="medic-img" />
      </header>
      <h1 className="medic-bold-text">Dr.
        {` ${props.firstName} ${props.lastName}`}
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

//Don't use same name for multiple functions in app. You have ProfileCard here and in AdminProfileCard
//A good practice, it's to implement the component in a common folder, and import where you needed.