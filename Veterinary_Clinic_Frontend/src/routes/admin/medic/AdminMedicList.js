import React, { useEffect, useState } from 'react';
import '../../medics/Medics.css';
import requestInstance from "../../../utils/RequestInstance";
import {Link} from 'react-router-dom';
import AdminMedicCard from '../medic/AdminProfileCard';

function AdminMedicList() {
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
      <div className='medics-container-admin'>
          <div className='py-4 medic-grid'>
              <div className='medic-add-container'>

                  <div>
                      <Link to={`/admin/dashboard/register-medic`}>
                          <img
                              src='https://img.freepik.com/free-vector/health-care-icon-vector_53876-175194.jpg?w=740&t=st=1695857677~exp=1695858277~hmac=2fe0e4c82c3ce5156a46a21f2f3438fca9acbae7cdfafbaea066585227ce09d6'
                              alt='green cross'
                              className="medic-add-img"
                          />
                      </Link>
                  </div>

              </div>
            {medics.map((medic, index) => (
              <AdminMedicCard
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
    </>
  );
}

export default AdminMedicList;