import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import requestInstance from "../../utils/RequestInstance";
import TokenService from "../../services/TokenService";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Step4({getFormValues, currentData, setPetDetails}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [phoneNumberError, setPhoneNumberError] = useState(null);
    const [preferences, setPreferences] = useState([]);
    const [selectedPreference, setSelectedPreference] = useState("");
    const user = TokenService.getUser();

    useEffect(() => {
        if (currentData) {
            setFirstName(currentData.firstName || "");
            setLastName(currentData.lastName || "");
            setPhoneNumber(currentData.phone || "");
            setEmail(currentData.email || "");
            setAddress(currentData.address || "");
        }
    }, [currentData]);

    //load preferences
    useEffect(() => {
        console.log(user)
        if(user===null)
            return;
        const boi = requestInstance.get(`http://localhost:8080/user-preferences/customer/${user.id}`)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
        const boi2 = async () => {
            const a = await boi;
            setPreferences(a);
        }
        boi2();
    }, []);

    function handleSelectPreference(preference) {
        if (preference != null) {
            preference.firstName ? setFirstName(preference.firstName) : setFirstName("");
            preference.lastName ? setLastName(preference.lastName) : setLastName("");
            preference.address ? setAddress(preference.address) : setAddress("");
            preference.email ? setEmail(preference.email) : setEmail("");
            preference.phone ? setPhoneNumber(preference.phone) : setPhoneNumber("");
            const petDetails = {
                petName: preference.name,
                petBreed: preference.breed,
                petType: preference.type,
                petAge: preference.age,
                petSex: preference.sex,
                petColor: preference.colour,
                extraNotes: preference.extraNotes
            };
            setPetDetails(petDetails);
        }
    }

    const isValidEmail = (email) => {
        const re = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        return re.test(email);
    };

    const handleEmail = (newEmail) => {
        if (isValidEmail(newEmail)) {
            setEmailError(null);
        } else {
            setEmailError("Invalid email");
        }
        setEmail(newEmail);
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const re = /^(\+)?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return re.test(phoneNumber);
    };

    const handlePhoneNumber = (newPhoneNumber) => {
        if (isValidPhoneNumber(newPhoneNumber)) {
            setPhoneNumberError(null);
        } else {
            setPhoneNumberError("Invalid phone number format");
        }
        setPhoneNumber(newPhoneNumber);
    };

    const handleFormChanges = (fieldName, value) => {
        switch (fieldName) {
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "phone":
                handlePhoneNumber(value);
                break;
            case "email":
                handleEmail(value);
                break;
            case "address":
                setAddress(value);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (firstName && lastName && phone && email && address && !emailError && !phoneNumberError) {
            getFormValues({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                address: address,
            });
        }
    }, [firstName, lastName, phone, email, address, emailError, phoneNumberError, getFormValues]);

    return (
        <>
            <FormGroup>
                {!(preferences.length===0) ?
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Preferences</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="select-preferences"
                                placeholder="Select a preferences"
                                value={selectedPreference}
                                label="Preferences"
                                onChange={(event) => {
                                    setSelectedPreference(event.target.value);
                                    handleSelectPreference(event.target.value);
                                }}
                            >
                                {
                                    preferences.map(option => {
                                        return (
                                            <MenuItem key={option}
                                                      value={option}>{option.firstName + " - " + option.lastName + " - " + option.name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    : ""
                }
                <TextField
                    onChange={(e) => handleFormChanges("firstName", e.target.value)}
                    value={firstName}
                    id="first-name"
                    label="First Name"
                    variant="standard"
                    sx={{width: "370px"}}
                />
                <TextField
                    onChange={(e) => handleFormChanges("lastName", e.target.value)}
                    value={lastName}
                    id="last-name"
                    label="Last Name"
                    variant="standard"
                    sx={{width: "370px"}}
                />
                <TextField
                    error={phoneNumberError ? true : false}
                    helperText={phoneNumberError}
                    onChange={(e) => handleFormChanges("phone", e.target.value)}
                    value={phone}
                    id="phone"
                    label="Phone"
                    variant="standard"
                    sx={{width: "370px"}}
                />
                <TextField
                    error={emailError ? true : false}
                    helperText={emailError}
                    onChange={(e) => handleFormChanges("email", e.target.value)}
                    value={email}
                    type="email"
                    id="email"
                    label="Email"
                    variant="standard"
                    sx={{width: "370px"}}
                />
                <TextField
                    onChange={(e) => handleFormChanges("address", e.target.value)}
                    value={address}
                    id="address"
                    label="Address"
                    variant="standard"
                    sx={{width: "370px"}}
                />
            </FormGroup>
        </>
    );
}

export default Step4;