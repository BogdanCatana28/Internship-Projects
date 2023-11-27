import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { ListItemIcon } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import RequestInstance from "../../utils/RequestInstance"

const availableIcons = [LocalHospitalIcon, HealingIcon, VaccinesIcon, MonitorHeartIcon, MedicalInformationIcon, BloodtypeIcon];

export default function Step1({ getServiceInfo, currentData }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [listOfServices, setListOfServices] = useState([]);

  useEffect(() => {
    RequestInstance.get('http://localhost:8080/procedures')
      .then(response => {
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        return response.data;
      })
      .then(data => {
        const mappedServices = data.map((procedure, index) => ({
          serviceId: procedure.id,
          serviceName: procedure.name,
          serviceLength: procedure.duration,
          iconSymbol: React.createElement(availableIcons[index % availableIcons.length]),
        }));
        setListOfServices(mappedServices);
      })
      .catch(error => {
        console.error('Error fetching procedures:', error);
      });
  }, []);

  useEffect(() => {
    if (currentData && currentData.serviceId !== undefined) {
      setSelectedIndex(
        listOfServices.findIndex(service => service.serviceId === currentData.serviceId)
      );
    }
  }, [currentData, listOfServices]);

  const handleListItemClick = (serviceId, serviceLength, index) => {
    const selectedService = listOfServices[index];

    if (currentData && currentData.serviceId === serviceId) {
      getServiceInfo(currentData);
    } else {
      getServiceInfo({
        serviceId: selectedService.serviceId,
        serviceLength: selectedService.serviceLength,
        serviceName: selectedService.serviceName,
      });
    }

    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="secondary mailbox folder">
        {listOfServices.map((service, idx) => (
          <ListItemButton
            key={service.serviceId}
            selected={selectedIndex === idx}
            onClick={() => handleListItemClick(service.serviceId, service.serviceLength, idx)}
          >
            <ListItemIcon>
              {service.iconSymbol}
            </ListItemIcon>
            <ListItemText primary={service.serviceName} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
//It's not recomanded to use inline style.
