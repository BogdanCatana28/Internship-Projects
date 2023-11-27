import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import Map from './Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <>
            <div className='footer-container'>
                <div className='map-links-container'>
                    <div className='footer-links-container'>
                        <div className='footer-link-wrapper'>
                            <div className='footer-link-items'>
                                <h2>GET IN TOUCH</h2>
                                <div className='contact-info'>
                                    <div className='contact-info-item'>
                                        <p><FontAwesomeIcon icon={faMapMarkerAlt} />  Address: Str. Frunzisului, Cluj-Napoca, Cluj, Romania</p>
                                    </div>
                                    <div className='contact-info-item'>
                                        <p><FontAwesomeIcon icon={faPhone} /> Phone: +40 789 123 456</p>
                                    </div>
                                    <div className='contact-info-item'>
                                        <p><FontAwesomeIcon icon={faEnvelope} /> Email: fluffyvet@gmail.com</p>
                                    </div>
                                </div>
                                <div className='social-icons'>
                                    <Link to='/'>
                                        <FontAwesomeIcon icon={faInstagram} />
                                        Instagram
                                    </Link>
                                    <Link to='/'>
                                        <FontAwesomeIcon icon={faFacebook} />
                                        Facebook
                                    </Link>
                                    <Link to='/'>
                                        <FontAwesomeIcon icon={faTwitter} />
                                        Twitter
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="map-container">
                        <Map />
                    </div>
                </div>
                <div className='social-media-container'>
                    <div className='social-media-wrap'>
                        <small className='website-rights'>Fluffy Vet © 2023</small>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;
