import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './AdminMedicDetails.css';
import requestInstance from "../../../utils/RequestInstance";

function AdminMedicDetails() {
  const [medic, setMedic] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    photo: '',
    specializations: '',
    education: '',
  });

  const { id } = useParams();

  useEffect(() => {
    loadMedic();
  }, []);

  const loadMedic = async () => {
    const result = await requestInstance.get(`http://localhost:8080/medics/${id}`);
    const avatar = await requestInstance.get(`http://localhost:8080/users/${id}/get-avatar`,{responseType: 'blob'})
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
    console.log(avatar)
    result.data.photo = avatar;
    setMedic(result.data);
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          <div className='card mt-4 shadow'>
            <div className='card-header bg-success text-white'>
              <h2 className='text-center m-4'>Medic Details</h2>
            </div>
            <div className='card-body'>
              <div className='medic-info'>
                <img className='photo' alt='' src={medic.photo} />
                <div className='details'>
                  <p>
                    <span className='label'>First Name:</span> {medic.firstName}
                  </p>
                  <p>
                    <span className='label'>Last Name:</span> {medic.lastName}
                  </p>
                  <p>
                    <span className='label'>Email:</span> {medic.email}
                  </p>
                  <p>
                    <span className='label'>Phone:</span> {medic.phone}
                  </p>
                  <p>
                    <span className='label'>Specializations:</span> {medic.specializations}
                  </p>
                  <p>
                    <span className='label'>Education:</span> {medic.education}
                  </p>
                </div>
              </div>
              <Link className='btn btn-primary my-2' to='/admin/medics'>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMedicDetails;