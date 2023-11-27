import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RequestInstance from "../../utils/RequestInstance"

export default function Step3({ getDateTime, selectedServiceInfo, selectedMedicInfo, currentData }) {
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  const getMonday = (d) => {
    const dt = new Date(d);
    const day = dt.getDay()
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(dt.setDate(diff));
  }

  const getEndOfNextWeek = (d) => {
    return moment(getMonday(d)).add(11,'days').toDate();
  }

  const handleChangeTime = (event) => {
    setSelectedTime(event.target.value);
    getDateTime(dateValue, event.target.value);
  };

  const handleChangeDate = (selectedDate) => {
    setDateValue(moment(new Date(selectedDate)).format('YYYY-MM-DD'));
  };

  useEffect(() => {

    if (currentData && currentData.date && currentData.time) {
      setDateValue(currentData.date);
      setSelectedTime(currentData.time);
    }
  }, [currentData]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await RequestInstance.get(
          `http://localhost:8080/appointments?medicId=${selectedMedicInfo.medicId}&procedureId=${selectedServiceInfo.serviceId}&date=${dateValue}`);
        const availableTimes = await response.data;
        setTimes(availableTimes);
      } catch (error) {
        console.error("Error fetching available times:", error);
        setTimes([]);
      }
    };

    if (selectedServiceInfo && selectedMedicInfo && dateValue) {
      fetchAvailableTimes();
    }
  }, [selectedServiceInfo, selectedMedicInfo, dateValue]);

  return (
    <Box sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}>
      <Typography variant="h5">
        {selectedServiceInfo.serviceName} will be about <b>{selectedServiceInfo.serviceLength} minutes</b> in length
      </Typography>
      <br />
      <FormControl fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            minDate={new Date()}
            maxDate={getEndOfNextWeek(new Date())}
            label="Select Date"
            inputFormat="MM/DD/YYYY"
            value={dateValue}
            onChange={handleChangeDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </FormControl>
      <br />
      <br />
      {times.length > 0 && (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Time</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedTime}
            label="Time"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
            onChange={(event) => handleChangeTime(event)}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {times.length === 0 && <h3>No available times for the selected date</h3>}
    </Box>
  );
}