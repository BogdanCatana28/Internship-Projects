import React, { useEffect, useState } from 'react';
import './Medics.css';
import requestInstance from "../../utils/RequestInstance";
import Footer from '../../components/footer/Footer';
import MedicCard from './ProfileCard';

function Medics() {
  const [medics, setMedics] = useState([]);

  useEffect(() => {
    loadMedics();
  }, []);

  async function loadAvatar(medic) {
    const avatar = await requestInstance.get(`http://localhost:8080/users/${medic.id}/get-avatar`, { responseType: 'blob' })
      .then(response => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Avatar not found');
        }
      })
      .then(blob => {
        if (blob.size > 0) {
          return URL.createObjectURL(blob);
        } else {
          return "/images/avatar.png";
        }
      })
      .catch(error => {
        return "/images/avatar.png";
      });
    medic.photo = avatar;
    return medic;
  }

  const loadMedics = async () => {
    const result = await requestInstance.get('http://localhost:8080/medics').then(response => {
      return response.data;
    })
      .then(data => {
        const medics = data.map(medic => {
          return loadAvatar(medic);
        });
        return medics;
      })
      .then(medics => {
        let newMedics = [];
        medics.forEach(medic => {
          newMedics.push(medic.then((response) => { return response }));
        })
        Promise.all(newMedics).then((response) => {
          setMedics(response);
        });
      });
  };

  return (
    <>
      <div className='medics-container'>
          <div className='py-4 medic-grid'>
            {medics.map((medic, index) => (
              <MedicCard
                key={index}
                firstName={medic.firstName}
                lastName={medic.lastName}
                specializations={medic.specializations}
                education={medic.education}
                experience={medic.experience}
                phone={medic.phone}
                email={medic.email}
                photo={medic.photo}
              />
            ))}
          </div>
        </div>
      <Footer />
    </>
  );
}

export default Medics;
