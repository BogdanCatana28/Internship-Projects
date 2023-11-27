import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./routes/authentication/Login";
import Register from "./routes/authentication/Register";
import HomePage from "./routes/home/HomePage";
import Footer from "./components/footer/Footer";
import Procedures from "./routes/admin/procedure/Procedures";
import AddProcedure from "./routes/admin/procedure/AddProcedures";
import EditProcedure from "./routes/admin/procedure/EditProcedure";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import SessionExpiredBox from "./components/session/SesionExpired";
import {logout} from "./slices/Auth";
import TokenService from "./services/TokenService";
import {refreshToken} from "./slices/Auth";
import axiosInstance from "./services/Api";
import CustomRoute from "./CustomeRoutes";
import ForgotPassword from "./components/password/ForgotPassword"
import ResetPassword from "./components/password/ResetPassword";
import AppointmentPage from "./routes/appointment/AppointmentPage";
import AccountPage from "./routes/account/AccountPage";
import PreferencePage from "./routes/account/PreferencesPage";
import PatientDetails from "./routes/medic/patient/patient-details/PatientDetails";
import PatientsView from "./routes/medic/patient/view-patients/PatientsView";
import PatientConsultDetails from "./routes/medic/patient/view-patients/PatientConsultDetails";
import AddPatientPage from "./routes/medic/patient/add-patient/AddPatientPage";
import MedicDashboard from "./routes/medic/dashboard/MedicDashboard";
import ConsultationPage from "./routes/medic/consultation/ConsultationPage";
import Medics from "./routes/medics/Medics";
import AdminDashboard from "./routes/admin/dashboard/AdminDashboard";
import AppointmentCalendar from "./routes/medic/calendar/AppointmentCalendar";
import Shifts from "./routes/admin/shifts/Shifts";
import AdminMedicList from "./routes/admin/medic/AdminMedicList";
import AdminMedicDetails from "./routes/admin/medic/AdminMedicDetails";
import RegisterMedic from "./routes/admin/medic/RegisterMedic";
import ViewMedic from "./routes/medics/ViewMedic";

function App() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [sessionExpired, setSessionExpired] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let sessionExpireTimeout;
        let tokenRefreshTimeout;

        if (isLoggedIn) {
            sessionExpireTimeout = setTimeout(() => {
                dispatch(logout());
                setSessionExpired(true);
            }, 3540000); // Logout after 59 mins


            tokenRefreshTimeout = setInterval(() => {
                refreshTokenAfter1Minute();
            }, 1800000); /// Refresh every 30 mins
        }

        return () => {
            clearTimeout(sessionExpireTimeout);
            clearTimeout(tokenRefreshTimeout);
        };
    }, [isLoggedIn, dispatch]);

    const refreshTokenAfter1Minute = () => {

        axiosInstance.post("/auth/refresh-token", {
            refreshToken: TokenService.getLocalRefreshToken(),
        })
            .then((response) => {
                const {accessToken} = response.data;
                dispatch(refreshToken(accessToken));
                TokenService.updateLocalAccessToken(accessToken);
            })
            .catch((error) => {

            });
    };


    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    {/* public content */}
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/appointment" element={<AppointmentPage/>}/>
                    <Route path="/medics" element={<Medics/>}/>
                    <Route path="/view-medic/:id" element={<ViewMedic/>}/>
                    {!isLoggedIn && (
                        <>
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                            <Route path="/reset-password/:token" element={<ResetPassword/>}/>
                        </>
                    )}

                    {/* CUSTOMER ONLY CONTENT MUST BE INTRODUCED */}

                    {/* ADMIN ONLY CONTENT  */}
                    <Route path='/admin' element={<CustomRoute roles={['ROLE_ADMIN']}/>}>
                        <Route path="shifts" element={<Shifts/>}/>
                        <Route path='dashboard' element={<AdminDashboard/>}>
                            <Route path="procedures" element={<Procedures/>}/>
                            <Route path="add-procedure" element={<AddProcedure/>}/>
                            <Route path="edit-procedure/:id" element={<EditProcedure/>}/>
                            <Route path="medics" element={<AdminMedicList/>}/>
                            <Route path="medic-details/:id" element={<AdminMedicDetails/>}/>
                            <Route path="register-medic" element={<RegisterMedic/>}/>
                        </Route>
                    </Route>
                    {/*<Route exact path='/procedures' element={<CustomRoute roles={['ROLE_ADMIN']}/>}>*/}
                    {/*    <Route exact path='/procedures' element={<Procedures/>}/>*/}
                    {/*</Route>*/}
                    {/*<Route exact path='/add-procedure' element={<CustomRoute roles={['ROLE_ADMIN']}/>}>*/}
                    {/*    <Route exact path='/add-procedure' element={<AddProcedure/>}/>*/}
                    {/*</Route>*/}
                    {/*<Route exact path='/edit-procedure/:id' element={<CustomRoute roles={['ROLE_ADMIN']}/>}>*/}
                    {/*    <Route exact path='/edit-procedure/:id' element={<EditProcedure/>}/>*/}
                    {/*</Route>*/}
                    {/* MEDIC ONLY CONTENT  */}
                    <Route path='/medic' element={<CustomRoute roles={['ROLE_MEDIC', 'ROLE_ADMIN']}/>}>
                        <Route path='dashboard' element={<MedicDashboard/>}>
                            <Route path='calendar' element={<AppointmentCalendar/>}/>
                            <Route path="patient-form" element={<AddPatientPage/>}/>
                            <Route path="patients" element={<PatientsView/>}/>
                            <Route path="patient-details/:id" element={<PatientDetails/>}/>
                            <Route path="patient-consult-details/:id" element={<PatientConsultDetails/>}/>
                            <Route path="consultation-form/:id" element={<ConsultationPage/>}/>
                        </Route>
                    </Route>

                    {/* Customer and Medic */}
                    <Route exact path='/account'
                           element={<CustomRoute roles={['ROLE_CUSTOMER', 'ROLE_MEDIC', 'ROLE_ADMIN']}/>}>
                        <Route exact path='/account' element={<AccountPage/>}/>
                    </Route>
                    <Route exact path='/preferences'
                           element={<CustomRoute roles={['ROLE_CUSTOMER', 'ROLE_MEDIC', 'ROLE_ADMIN']}/>}>
                        <Route exact path='/preferences' element={<PreferencePage/>}/>
                    </Route>


                    {/* Random Routes  */}
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </BrowserRouter>
            {sessionExpired && (
                <SessionExpiredBox
                    onLogout={() => {
                        dispatch(logout());
                        setSessionExpired(false);
                    }}
                />
            )}
        </div>
    );
}


export default App;