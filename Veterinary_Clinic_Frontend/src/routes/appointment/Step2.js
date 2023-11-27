import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RequestInstance from "../../utils/RequestInstance"

export default function Step2({ getMedicInfo, currentData, selectedServiceId }) {
  const [selectedMedicId, setSelectedMedicId] = useState(null);
  const [medics, setMedics] = useState([]);

  useEffect(() => {
    if (selectedServiceId !== null) {
      RequestInstance.get(`http://localhost:8080/medics?procedureId=${selectedServiceId}`)
        .then(response => {
          // if (!response.ok) {
          //   throw new Error('Network response was not ok');
          // }
          return response.data;
        })
        .then(data => {
          setMedics(data);
        })
        .catch(error => {
          console.error('Error fetching medics:', error);
        });
    }

    if (currentData && currentData.medicId !== undefined) {
      setSelectedMedicId(currentData.medicId);
    }
  }, [selectedServiceId, currentData]);

  const handleMedicSelectionChange = (medicId, medicName) => {
    setSelectedMedicId(medicId);
    getMedicInfo({
      medicId: medicId,
      medicName: medicName,
    });
  };

  return (
    <Box sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}>
      <FormControl>
        {medics.length > 0 ? (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <FormLabel style={{ color: '#5A5A5A' }} id={`accordion-label`}>
                Available Medics
              </FormLabel>
            </AccordionSummary>
            <AccordionDetails>
              {medics
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((medic) => (
                  <RadioGroup
                    key={medic.id}
                    row
                    aria-labelledby={`accordion-label`}
                    name={`radio-buttons-group-${medic.id}`}
                  >
                    <FormControlLabel
                      key={medic.id}
                      value={medic.id.toString()}
                      control={
                        <Radio
                          onChange={() => handleMedicSelectionChange(medic.id, `${medic.firstName} ${medic.lastName}`)}
                        />
                      }
                      checked={medic.id === selectedMedicId}
                      label={`${medic.firstName} ${medic.lastName}`}
                    />
                  </RadioGroup>
                ))}
            </AccordionDetails>
          </Accordion>
        ) : (
          <b>No medics available for this service</b>
        )}
      </FormControl>
    </Box>
  );
}