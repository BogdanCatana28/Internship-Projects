import {createSlice, createAsyncThunk, isFulfilled} from "@reduxjs/toolkit";
import { setMessage } from "./Message";

import medicService from "../services/MedicService";

const initialState = {

    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
}

export const addPatient = createAsyncThunk(
    "addPatient",
    async ({
               //patient
               patientName,
               patientAgeYears,
               patientAgeMonths,
               patientBirthdate,
               patientWeight,
               patientType,
               patientSex,
               patientBreed,
               patientColour,
               patientMedicalHistoryBeforeClinic,
               // owner
               firstName,
               lastName,
               email,
               address,
               phone,
               userId,
               userAlreadyRegistered}, thunkAPI) => {
        try {
            const response = await medicService.addPatient(
                //patient
                patientName,
                patientAgeYears,
                patientAgeMonths,
                patientBirthdate,
                patientWeight,
                patientType,
                patientSex,
                patientBreed,
                patientColour,
                patientMedicalHistoryBeforeClinic,
                // owner
                firstName,
                lastName,
                email,
                address,
                phone,
                userId,
                userAlreadyRegistered);

            thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data.message && error.response.data) ||
                             error.message ||
                             error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const addConsultation = createAsyncThunk(
    "addConsultation",
    async ({
               //patient
               patientId,
               patientName,
               patientBirthdate,
               patientWeight,
               patientType,
               patientSex,
               patientBreed,
               patientColour,
               // owner
               ownerFName,
               ownerLName,
               ownerEmail,
               ownerAddress,
               ownerPhone,
               //consultation
               consultMainConcern,
               historyOfConcern,
               consultDiagnostic,
               consultTreatment,
               consultExtraNotes }, thunkAPI) => {
        try {
            const response = await medicService.addConsultation(
                //patient
                patientId,
                patientName,
                patientBirthdate,
                patientWeight,
                patientType,
                patientSex,
                patientBreed,
                patientColour,
                // owner
                ownerFName,
                ownerLName,
                ownerEmail,
                ownerAddress,
                ownerPhone,
                //consultation
                consultMainConcern,
                historyOfConcern,
                consultDiagnostic,
                consultTreatment,
                consultExtraNotes);

            thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data.message && error.response.data) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

const medicSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: {
        // *********** ADD PATIENT ************ */
        [addPatient.fulfilled]: (state, action) => {
            //smth
        },
        [addPatient.rejected]: (state, action) => {
            //smth
        },
        // *********** ADD CONSULTATION ************ */
        [addConsultation().fulfilled]: (state, action) => {
            //smth
        },
        [addConsultation.rejected]: (state, action) => {
            //smth
        }
    }
});

const { reducer } = medicSlice;
export default reducer;

