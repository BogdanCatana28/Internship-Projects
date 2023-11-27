import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {FormControl, InputLabel} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import requestInstance from "../../utils/RequestInstance";
import {GET_PATIENT_SEXES_URL, GET_PATIENT_TYPES_URL} from "../../utils/Consts";


export default function Step5({getPetDetails, currentData}) {
    const [petName, setPetName] = useState(null);
    const [petBreed, setPetBreed] = useState(null);
    const [petAge, setPetAge] = useState(null);
    const [petType, setPetType] = useState('');
    const [petColor, setPetColor] = useState(null);
    const [petSex, setPetSex] = useState('');
    const [extraNotes, setExtraNotes] = useState('');

    const handlePetAgeChange = (event) => {
        setPetAge(event.target.value);
    };

    const handleTypeChange = (event) => {
        setPetType(event.target.value);
    };

    const handleSexChange = (event) => {
        setPetSex(event.target.value);
    }

    useEffect(() => {
        if (petName && petBreed && petType && petSex) {
            getPetDetails({
                petName: petName,
                petBreed: petBreed,
                petType: petType,
                petAge: petAge,
                petSex: petSex,
                petColor: petColor,
                extraNotes: extraNotes
            });
        }
    }, [petName, petBreed, petType, petAge, petSex, petColor, extraNotes, getPetDetails]);

    useEffect(() => {
        console.log("YES")
        console.log(currentData)
        if (currentData) {
            setPetName(currentData.petName || null);
            setPetBreed(currentData.petBreed || null);
            setPetAge(currentData.petAge || null);
            setPetType(currentData.petType || '');
            setPetColor(currentData.petColor || null);
            setPetSex(currentData.petSex || '');
            setExtraNotes(currentData.extraNotes || '');
        }
    }, [currentData]);

    // PATIENT_TYPES
    const [patientTypes, setPatientTypes] = useState([]);
    const fetchPatientTypes = () => {
        console.log("fetching")
        return requestInstance.get(GET_PATIENT_TYPES_URL)
            .then((data) => {
                return data.data;
            })
            .then(patientTypes => setPatientTypes(patientTypes))
    }

    // PATIENT_SEX
    const [patientSexes, setPatientSexes] = useState([]);
    const fetchPatientSex = () => {
        console.log("fetching")
        return requestInstance.get(GET_PATIENT_SEXES_URL)
            .then((data) => {
                return data.data;
            })
            .then(patientSexes => setPatientSexes(patientSexes))
    }

    useEffect(() => {
        fetchPatientSex();
        fetchPatientTypes();
    }, []);

    return (
        <>
            <FormGroup>
                <TextField onChange={(e) =>
                    setPetName(e.target.value)}
                           value={petName}
                           id="pet-name"
                           label="Name"
                           variant="standard" sx={{width: '370px'}}/>
                <FormControl label="Type" variant="standard" sx={{width: '370px'}}>
                    <InputLabel id="pet-type-label">Type</InputLabel>
                    <Select
                        labelId="pet-type-label"
                        id="petType"
                        value={petType}
                        onChange={handleTypeChange}
                        label="Pet Type"
                    >
                        {
                            patientTypes.map(option => {
                                return (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <TextField onChange={(e) => setPetBreed(e.target.value)}
                           id="pet-breed"
                           label="Breed"
                           variant="standard"
                           sx={{width: '370px'}}
                           value={petBreed}
                />
                <TextField onChange={(e) => setPetColor(e.target.value)}
                           id="pet-color"
                           label="Color (opt.)"
                           variant="standard"
                           sx={{width: '370px'}}
                           value={petColor}
                />
                <FormControl label="Pet Sex" variant="standard" sx={{width: '370px'}}>
                    <InputLabel id="pet-sex-label">Sex</InputLabel>
                    <Select
                        labelId="pet-sex-label"
                        id="petSex"
                        value={petSex}
                        onChange={handleSexChange}
                        label="Pet Sex"
                    >
                        {
                            patientSexes.map(option => {
                                return (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <TextField onChange={handlePetAgeChange}
                           id="pet-age"
                           label="Age (opt.)"
                           variant="standard"
                           sx={{width: '370px'}}
                           value = {petAge}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <Typography variant="caption" sx={{fontSize: '14px'}}>months</Typography>
                                   </InputAdornment>),
                           }}/>
                <TextField
                    onChange={(e) => setExtraNotes(e.target.value)}
                    id="extra-notes"
                    label="Extra Notes (opt.)"
                    multiline
                    maxRows={4}
                    variant="standard"
                    sx={{width: '370px'}}
                    value={extraNotes}
                />
            </FormGroup>
        </>
    );
}