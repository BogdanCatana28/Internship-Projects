import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import TokenService from '../../services/TokenService';

export default function VerticalLinearStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedServiceInfo, setSelectedServiceInfo] = useState(null);
    const [selectedMedicInfo, setSelectedMedicInfo] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [formValues, setFormValues] = useState(null);
    const [petDetails, setPetDetails] = useState(null);

    const theme = createTheme({
        palette: {
            primary: {
                main: 'rgb(63, 189, 99)',
            },
        },
        typography: {
            fontSize: 16,
        },
    });

    const addAppointmentToDatabase = async (petDetails) => {
        const appointmentData = {
            dateReservation: selectedDateTime.date + 'T' + selectedDateTime.time,
            procedureId: selectedServiceInfo.serviceId,
            medicId: selectedMedicInfo.medicId,
            extraNotes: petDetails.extraNotes,
            ownerFirstName: formValues.firstName,
            ownerLastName: formValues.lastName,
            ownerAddress: formValues.address,
            ownerEmail: formValues.email,
            ownerPhone: formValues.phone,
            patientName: petDetails.petName,
            patientSex: petDetails.petSex,
            patientType: petDetails.petType,
            patientBreed: petDetails.petBreed,
            patientColour: petDetails.petColor,
            patientAge: petDetails.petAge,
        };

        try {
            const response = await fetch('http://localhost:8080/appointments', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + TokenService.getLocalAccessToken(),
                },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Appointment added:', responseData);
            } else {
                console.error('Error adding appointment:', response.status);
            }
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            addAppointmentToDatabase(petDetails);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setSelectedServiceInfo(null);
        setSelectedMedicInfo(null);
        setSelectedDateTime(null);
        setFormValues(null);
        setPetDetails(null);
    };

    const [userPreferenceStatus, setUserPreferenceStatus] = useState("");

    const handleSavePreferences = async () => {

        const data = {
            customerId : TokenService.getUser().id,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            address: formValues.address,
            email: formValues.email,
            phone: formValues.phone,
            name: petDetails.petName,
            sex: petDetails.petSex,
            type: petDetails.petType,
            breed: petDetails.petBreed,
            colour: petDetails.petColor,
            age: petDetails.petAge,
        };

        const response = await fetch('http://localhost:8080/user-preferences', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TokenService.getLocalAccessToken(),
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            setUserPreferenceStatus("User preference saved!");
            //alert("Saved");
        } else {
            setUserPreferenceStatus("User preference already saved!");
            //alert("Preference already saved!");
        }
    };

    const steps = [
        {
            label: 'Select a service',
            description: <Step1 getServiceInfo={setSelectedServiceInfo} currentData={selectedServiceInfo} />,
        },
        {
            label: 'Select a medic',
            description: (
                <Step2
                    getMedicInfo={setSelectedMedicInfo}
                    currentData={selectedMedicInfo}
                    selectedServiceId={selectedServiceInfo?.serviceId}
                />
            ),
        },
        {
            label: 'Select a date and time',
            description: (
                <Step3
                    getDateTime={(date, time) => setSelectedDateTime({ date, time })}
                    selectedServiceInfo={selectedServiceInfo}
                    selectedMedicInfo={selectedMedicInfo}
                    currentData={selectedDateTime}
                />
            ),
        },
        {
            label: 'Enter contact information',
            description: <Step4 getFormValues={setFormValues} currentData={formValues} setPetDetails={setPetDetails} />,
        },
        {
            label: 'Enter pet details',
            description: (
                <div>
                    <Typography variant="caption" color="error">
                        (* All fields are required unless specified optional)
                    </Typography>
                    <Step5 getPetDetails={setPetDetails} currentData={petDetails} />
                </div>
            ),
        },
    ];

    const isStepComplete = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return selectedServiceInfo !== null;
            case 1:
                return selectedMedicInfo !== null;
            case 2:
                return selectedDateTime !== null;
            case 3:
                return formValues !== null;
            case 4:
                return petDetails !== null;
            default:
                return false;
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                            <StepContent>
                                <Typography>{step.description}</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                            disabled={!isStepComplete(index)}
                                        >
                                            {index === steps.length - 1 ? 'Confirm' : 'Continue'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography variant="h5" style={{ color: '#009688' }}>
                            Your appointment on {selectedDateTime.date} at {selectedDateTime.time} for{' '}
                            {selectedServiceInfo.serviceName} with {selectedMedicInfo.medicName} has been confirmed!
                        </Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Create Another Appointment
                        </Button>
                        {TokenService.getUser()?
                            <>
                                <Button onClick={handleSavePreferences}>
                                    Save details to preferences?
                                </Button>
                                <div>
                                    {userPreferenceStatus}
                                </div>
                            </>
                            :""
                        }
                    </Paper>
                )}
            </Box>
        </ThemeProvider>
    );
}
