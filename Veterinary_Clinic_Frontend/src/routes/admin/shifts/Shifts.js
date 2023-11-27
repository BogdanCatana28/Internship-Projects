import * as React from 'react';
import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {
    EditingState,
    GroupingState,
    IntegratedEditing,
    IntegratedGrouping,
    ViewState
} from '@devexpress/dx-react-scheduler';
import {
    AllDayPanel,
    AppointmentForm,
    Appointments,
    AppointmentTooltip, ConfirmationDialog, CurrentTimeIndicator,
    DateNavigator,
    DragDropProvider,
    GroupingPanel,
    MonthView,
    Resources,
    Scheduler,
    TodayButton,
    Toolbar,
    ViewSwitcher,
    WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import {alpha, styled} from "@mui/material";
import moment from "moment";
import requestInstance from "../../../utils/RequestInstance";
import TimedPopup from "../../../components/popup/TimedPopup";
import "./Shifts.css";
//--------------------------------------DATA--------------------------------------------------------

const colorPalette = ["#26c6da", "#26a69a", "#2cd0bd", "#0288d1", "#03a9f4", "#18ffff"];


const classes = {
    todayCell: `todayCell`,
    today: `today`,
    commandButton: `commandButton`,
};

//--------------------------------------TODAY-STYLE--------------------------------------------------------
const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({theme}) => ({
    [`&.${classes.todayCell}`]: {
        backgroundColor: alpha("#43a047", 0.2),
        '&:hover': {
            backgroundColor: alpha("#43a047", 0.25),
        },
        '&:focus': {
            backgroundColor: alpha("#43a047", 0.28),
        },
    },
}));


const TimeTableCell = (props) => {
    const {startDate} = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell}/>;
    }
    return <StyledWeekViewTimeTableCell {...props} />;
};


//-----------------------------------------------APPOINTMENT-FROM---------------------------------------------

//--------------------------------------CALENDAR--------------------------------------------------------

function Shifts() {

    const [appointments, setAppointments] = useState([]);

    const [medics, setMedics] = useState([{
        text: '',
        id: 1,
    }]);

    const days = [{
        text: 'Shift',
        id: 1,
        color: "#46db6e",
    }, {
        text: 'Day Off',
        id: 2,
        color: "#26c6da",
    }];

    const resources = [{
        fieldName: 'medics',
        title: 'Medics',
        instances: medics,
    }, {
        fieldName: 'days',
        title: 'Type',
        instances: days,
    }]
    const grouping = [{
        resourceName: 'medics',
    }]
    const getMonday = (d) => {
        const dt = new Date(d);
        const day = dt.getDay()
        const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(dt.setDate(diff));
    }

    const [currentDate, setCurrentDate] = useState(convertDate(getMonday(Date.now())));
    const [isDayOff, setIsDayOff] = useState(false);
    const [appointmentsIndex, setAppointmentsIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [messageType, setMessageType] = useState("");


    function convertDate(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    function convertDateTime(date) {
        return moment(date).add(3, 'hours')
    }

    const currentDateChange = (currentDate) => {
        console.log(currentDate)
        setCurrentDate(convertDate(getMonday(currentDate)));
    };


    function fetchMedics() {
        requestInstance.get(`http://localhost:8080/medics`)
            .then((response) => {
                return response.data;
            })
            .then(data => {
                const medicsInstances = data.map(medic => ({
                    id: medic.id,
                    text: medic.firstName + " " + medic.lastName,
                }))
                setMedics(medicsInstances);
            })
    }

    function fetchShifts() {
        return requestInstance.get(`http://localhost:8080/shifts/weekly?date=${currentDate}`)
            .then((response) => {
                return response.data;
            })
            .then(data => {
                return data.map((shift) => {
                    return ({
                        shiftId: shift.id,
                        title: "Shift",
                        medics: shift.medicId,
                        days: 1,
                        startDate: shift.startTime,
                        endDate: shift.endTime,
                    })
                });
            });
    }

    function fetchDaysOff() {
        return requestInstance.get(`http://localhost:8080/days-off/weekly?date=${currentDate}`)
            .then((response) => {
                return response.data;
            })
            .then(data => {
                return data.map((dayOff) => {
                    return ({
                        dayOffId: dayOff.id,
                        title: "Day Off",
                        medics: dayOff.medicId,
                        days: 2,
                        startDate: dayOff.freeDay,
                        endDate: moment(dayOff.freeDay).add(1, 'days').toDate(),
                        allDay: true,
                    })
                });
            });
    }

    useEffect(() => {
        const setData = async () => {
            await fetchMedics();
            const shifts = await fetchShifts().then((response) => {
                return response
            });
            const daysOff = await fetchDaysOff().then((response) => {
                return response
            });

            if (daysOff !== undefined)
                daysOff.forEach((dayOff) => {
                    shifts.push(dayOff);
                });
            const mappedAppointments = shifts.map((appointment, index) => {
                appointment.id = index;
                return appointment;
            })
            setAppointmentsIndex(mappedAppointments.length)
            setAppointments(mappedAppointments);
        };
        setData().catch((error) => {
            console.log(error);
            // alert(error.response.data.message);
            setPopupMessage(error.response.data.message);
            setShowPopup(true);
            setMessageType("error");
        });
    }, [currentDate, isDayOff]);


    const vertical = viewName => "Horizontal"

    const [addedAppointment, setAddedAppointment] = useState({});
    const [appointmentChanges, setAppointmentChanges] = useState({});
    const [editingAppointment, setEditingAppointment] = useState(undefined);

    function changeAddedAppointment(addedAppointment) {
        setAddedAppointment(addedAppointment);
    }

    function changeAppointmentChanges(appointmentChanges) {
        setAppointmentChanges(appointmentChanges);
    }

    function changeEditingAppointment(editingAppointment) {
        setEditingAppointment(editingAppointment);
    }

    async function addShift(added) {
        const shift = {
            medicId: added.medics,
            startTime: convertDateTime(added.startDate),
            endTime: convertDateTime(added.endDate),
        }
        return await requestInstance.post(`http://localhost:8080/shifts`, shift)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
                return error.response.data;
            });
    }

    async function addDayOff(added) {
        const dayOff = {
            medicId: added.medics,
            freeDay: convertDateTime(added.startDate).format('YYYY-MM-DD'),
        }
        return await requestInstance.post(`http://localhost:8080/days-off`, dayOff)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
                return error.response.data;
            });
    }

    async function deleteShift(appointment) {
        await requestInstance.delete(`http://localhost:8080/shifts/${appointment.shiftId}`)
            .then(() => {
                setMessageType("success");
                setShowPopup(true);
                setPopupMessage("Shift deleted successfully");
                return true;
            })
            .catch((error) => {
                setMessageType("error");
                setShowPopup(true);
                setPopupMessage(error.response.data.message);
                return false;
            });
    }

    async function deleteDayOff(appointment) {
        await requestInstance.delete(`http://localhost:8080/days-off/${appointment.dayOffId}`)
            .then(() => {
                setMessageType("success");
                setShowPopup(true);
                setPopupMessage("Day Off deleted successfully");
                return true;
            })
            .catch((error) => {
                setMessageType("error");
                setShowPopup(true);
                setPopupMessage(error.response.data.message);
                return false;
            });
    }

    async function deleteAppointment(appointment) {
        if (appointment.days === 1) {
            return await deleteShift(appointment);
        } else {
            return await deleteDayOff(appointment);
        }
    }

    function updateShift(appointment) {
        const shift = {
            id: appointment.shiftId,
            medicId: appointment.medics,
            startTime: convertDateTime(appointment.startDate),
            endTime: convertDateTime(appointment.endDate),
        }
        return requestInstance.put(`http://localhost:8080/shifts`, shift)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
                return error.response.data;
            });
    }

    function updateDayOff(appointment) {

    }

    function updateAppointment(appointment) {
        if (appointment.days === 1) {
            return updateShift(appointment);
        } else {
            updateDayOff(appointment);
        }

    }

    function validateShift(shift) {
        let startDate = moment(shift.startDate);
        let endDate = moment(shift.endDate);
        if (startDate.isAfter(endDate)) {
            return {
                status: false,
                message: "Start date must be before end date",
            };
        }
        if (endDate.diff(startDate, "hours", true) >= 12) {
            return {
                status: false,
                message: "Shift must be less than 12 hours",
            };
        }
        if (startDate.hours() >= 20 || startDate.hours() <= 6) {
            return {
                status: false,
                message: "Shift must be between 07:00 and 20:00",
            };
        }
        return {
            status: true,
            message: "ok",
            appointment: shift,
        }

    }

    function validateDayOff(dayOff) {
        let startDate = moment(dayOff.startDate);
        let endDate = moment(dayOff.endDate);
        return {
            status: false,
            message: "You can only add and delete days off",
        }
    }

    function validate(changedAppointment, appointment) {
        const newAppointment = {
            startDate: changedAppointment.startDate ? changedAppointment.startDate : appointment.startDate,
            endDate: changedAppointment.endDate ? changedAppointment.endDate : appointment.endDate,
            medics: changedAppointment.medics ? changedAppointment.medics : appointment.medics,
            title: changedAppointment.title ? changedAppointment.title : appointment.title,
            days: changedAppointment.days ? changedAppointment.days : appointment.days,
            allDay: changedAppointment.allDay ? changedAppointment.allDay : appointment.allDay,
            id: appointment.id,
            shiftId: appointment.shiftId ? appointment.shiftId : undefined,
            dayOffId: appointment.dayOffId ? appointment.dayOffId : undefined,
        }

        if (newAppointment.days === 1) {
            return validateShift(newAppointment);
        } else {
            return validateDayOff(newAppointment);
        }
    }

    async function commitChanges({added, changed, deleted}) {
        const newAppointments = [];
        if (deleted !== undefined) {
            for (const appointment of appointments) {
                if (appointment.id !== deleted) {
                    newAppointments.push(appointment);
                } else {
                    const success = await deleteAppointment(appointment);
                    console.log(success)
                    if (!success) {
                        newAppointments.push(appointment);
                    }
                }
            }
        } else {
            if (added) {
                let addedItem;
                if (added.days === 1) {
                    addedItem = await addShift(added);
                    if (addedItem.message !== undefined) {
                        // alert(addedItem.message)
                        setPopupMessage(addedItem.message);
                        setShowPopup(true);
                        setMessageType("error");
                        return;
                    }
                    added.shiftId = addedItem.id;
                    addedItem.title = "Shift";
                } else {
                    addedItem = await addDayOff(added);
                    if (addedItem.message !== undefined) {
                        // alert(addedItem.message)
                        setPopupMessage(addedItem.message);
                        setShowPopup(true);
                        setMessageType("error");
                        return;
                    }
                    addedItem.title = "Day Off";
                    added.dayOffId = addedItem.id;
                    setIsDayOff(!isDayOff);
                }
                added.id = appointmentsIndex;
                setAppointmentsIndex(appointmentsIndex + 1);
                added.title = addedItem.title;
                appointments.push(added);
            }
            if (changed) {
                for (const appointment of appointments) {
                    let changedAppointment = changed[appointment.id];
                    if (changedAppointment) {
                        const arg = validate(changedAppointment, appointment);
                        if (arg.status === true) {
                            const response = await updateAppointment(arg.appointment);
                            if (response.message !== undefined) {
                                // alert(response.message)
                                setPopupMessage(response.message);
                                setShowPopup(true);
                                setMessageType("error");
                                return;

                            }
                            appointment.startDate = changedAppointment.startDate ? changedAppointment.startDate : appointment.startDate;
                            appointment.endDate = changedAppointment.endDate ? changedAppointment.endDate : appointment.endDate;
                            appointment.medics = changedAppointment.medics ? changedAppointment.medics : appointment.medics;
                            appointment.title = changedAppointment.title ? changedAppointment.title : appointment.title;
                            appointment.days = changedAppointment.days ? changedAppointment.days : appointment.days;
                            appointment.allDay = changedAppointment.allDay ? changedAppointment.allDay : appointment.allDay;
                        } else {
                            // alert(arg.message);
                            setPopupMessage(arg.message);
                            setShowPopup(true);
                            setMessageType("error");
                        }
                    }

                }
            }
            appointments.forEach(appointment => {
                newAppointments.push(appointment)
            });
        }
        setAppointments(newAppointments);
    }


    return (
        <React.Fragment>
            {showPopup && <TimedPopup message={popupMessage} messageType={messageType} isVisible={showPopup}
                                      setIsVisible={setShowPopup}/>}
            <Paper>
                <Scheduler
                    data={appointments}
                    height="auto"
                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={currentDateChange}
                    />
                    <EditingState
                        onCommitChanges={commitChanges}
                        addedAppointment={addedAppointment}
                        onAddedAppointmentChange={changeAddedAppointment}
                        appointmentChanges={appointmentChanges}
                        onAppointmentChangesChange={changeAppointmentChanges}
                        editingAppointment={editingAppointment}
                        onEditingAppointmentChange={changeEditingAppointment}

                    />
                    <GroupingState grouping={grouping} groupOrientation={vertical}/>
                    <Toolbar/>
                    <ViewSwitcher/>
                    <DateNavigator/>
                    <TodayButton/>

                    <WeekView
                        startDayHour={7}
                        endDayHour={20}
                        cellDuration={60}
                        excludedDays={[0, 6]}
                        timeTableCellComponent={TimeTableCell}
                    />
                    <MonthView/>
                    <AllDayPanel/>

                    <Appointments/>

                    <Resources
                        data={resources}
                        palette={colorPalette}
                    />

                    <IntegratedGrouping/>
                    <IntegratedEditing/>

                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                        showDeleteButton
                    />
                    <AppointmentForm
                        textEditorComponent={() => {
                            return null;
                        }}

                        labelComponent={(props) => {
                            if (props.text === "More Information")
                                return null;
                            return <AppointmentForm.Label {...props}/>;
                        }}
                        booleanEditorComponent={() => {
                            return null;
                        }}
                    />
                    <GroupingPanel/>
                    <DragDropProvider/>
                    <CurrentTimeIndicator
                        shadePreviousCells
                        shadePreviousAppointments
                    />
                    <ConfirmationDialog
                        ignoreCancel
                        layoutComponent={(props) => {
                            console.log(props)
                            return <ConfirmationDialog.Layout {...props} className="shifts-confirmation-layout"/>
                        }}
                        buttonComponent={(props) => {
                            console.log(props)
                            return <ConfirmationDialog.Button {...props} className="shifts-confirmation-button"/>
                        }}
                    />
                </Scheduler>
            </Paper>
        </React.Fragment>
    );
}


export default Shifts;

//The file it's too big 