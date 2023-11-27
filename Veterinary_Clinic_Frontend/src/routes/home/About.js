import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="two-column-container">
            <div className="left-column">
                <img src="./images/about.png" alt="Your Image" />
            </div>
            <div className="right-column">
                <div class="home-page-welcome">
                    <h1 className="">Our goal</h1>
                </div>
                {/*<h2 className="custom-heading">This is what we do here!</h2>*/}
                {/* Remove comments */}
                <p className="custom-paragraph">
                    We work alongside multiple pet rescue organizations by providing them with discounted services and medications to treat relinquished, abandoned and stray animals as they are awaiting adoption to new homes. We love getting involved with animal rescues, shelters, charity events, adoption fairs, and more to give back and help as many animals and animal caregivers as possible. Most of all, we enjoy building lasting partnerships.
                </p>
                <p className="custom-paragraph">
                    Love matters... and you're in good hands!

                    We believe in taking care of both pets and people. We pay attention to the little things, that make your visit comfortable, but also a rewarding experience for your dog or cat. The staff at Fluffy Vet Clinic is fully-invested in your pet’s health, happiness, and the time that they have with you. We appreciate your open and honest communication, and thank you for entrusting us with the care of your pets.
                </p>
            </div>
        </div>
    );
};

export default About;
