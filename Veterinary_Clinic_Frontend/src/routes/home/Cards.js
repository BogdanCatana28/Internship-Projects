import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
    return (
        <div className='cards'>
            <h1 className='cards-h1'>Take a peak at what we have to offer!</h1>
            <div className='cards__container'>
                <div className='cards__wrapper'>
                    <ul className='cards__items'>
                        <CardItem
                            src='images/dental.png'
                            text='Dental hygiene and care is not just important for humans but pets as well.'
                            label='Dentistry'
                            price='$50'
                            duration='1 hour'
                        />

                        <CardItem
                            src='images/consultation.png'
                            text='Consultations are the first step in your pet’s treatment journey.'
                            label='Medical Consultation'
                            price='$30'
                            duration='30 mins'
                        />
                    </ul>
                    <ul className='cards__items'>
                        <CardItem
                            src='images/surgery.png'
                            text='Common orthopedic pet surgeries include bone fracture repair, cruciate ligament repair.'
                            label='Surgery'
                            price='$60 - $250'
                            duration='1 - 3 hours'
                        />
                        <CardItem
                            src='images/vaccine.png'
                            text='Our clinics make it easy and affordable to keep your pet’s vaccination up to date. '
                            label='Vaccination'
                            price='$15'
                            duration='10 mins'
                        />
                        <CardItem
                            src='images/daily.png'
                            text='As part of regular check-ups, our veterinarians will conduct tests and bloodwork to get a complete picture of health.'
                            label='Veterinary Care'
                            price='$40'
                            duration='25 mins'
                        />
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Cards;