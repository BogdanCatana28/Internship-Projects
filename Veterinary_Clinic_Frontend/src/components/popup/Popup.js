import React, { useState, useEffect } from 'react';
import "./Popup.css";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const CustomPopup = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return isVisible ? (
    <div className="popup">
      <div className="popup-content">
        {message}
      </div>
    </div>
  ) : null;
};
//You don't use CustomPopup here, make a separated component. 
const Popup = ({ message, isVisible, setIsVisible, link}) => {

    const navigate = useNavigate();

  return isVisible ? (
      <div className="popup">
        <div className="popup-content">
          {message}
        </div>
        <div>
            <Button onClick={() => {
                setIsVisible(false);
                if(link) {
                    navigate(link)
                }
            }
            }>Close</Button>
        </div>
      </div>
  ) : null;
}


export default Popup;
