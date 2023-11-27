import * as React from 'react';
import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {
    Appointments,
    AppointmentTooltip,
    CurrentTimeIndicator,
    DateNavigator,
    Resources,
    Scheduler,
    TodayButton,
    Toolbar,
    WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import {Phone} from "@mui/icons-material";
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PaletteIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {alpha, Grid, IconButton, styled, Tooltip, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import moment from "moment";
import requestInstance from "../../../utils/RequestInstance";
import TokenService from "../../../services/TokenService";

//--------------------------------------DATA--------------------------------------------------------

const colorPalette = ["#26c6da","#26a69a","#2cd0bd","#0288d1","#03a9f4","#18ffff"];

function PatientSex(props) {
    const patientSex = props.patientSex;
    if (patientSex==="FEMALE") {
        return <FemaleIcon />;
    }
    return <MaleIcon />;
}

const Content = ({ children, appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={0.6}/>
            <Grid item xs={1}><PersonIcon/></Grid>
            <Grid item xs={4}>{appointmentData.ownerFirstName} {appointmentData.ownerLastName}</Grid>

            <Grid item xs={1}><PetsIcon/></Grid>
            <Grid item xs={4}>{appointmentData.petName}, {appointmentData.petType}, {appointmentData.petBreed}</Grid>
            <Grid item xs={1.4}/>

            <Grid item xs={0.6}/>
            <Grid item xs={1}><Phone/></Grid>
            <Grid item xs={4}>{appointmentData.ownerPhone}</Grid>

            <Grid item xs={1}><PatientSex patientSex={appointmentData.petSex}/></Grid>
            <Grid item xs={4}>{appointmentData.petSex}</Grid>
            <Grid item xs={1.4}/>

            <Grid item xs={0.6}/>
            <Grid item xs={1}><HomeIcon/></Grid>
            <Grid item xs={4}>{appointmentData.ownerAddress}</Grid>

            {appointmentData.petAge?
                <>
                    <Grid item xs={1}><CalendarTodayIcon/></Grid>
                    <Grid item xs={4}>{appointmentData.petAge} months</Grid>
                    <Grid item xs={1.4}/>
                </>
                :
                appointmentData.petColor?
                    <>
                        <Grid item xs={1}><PaletteIcon/></Grid>
                        <Grid item xs={4}>{appointmentData.petColor}</Grid>
                        <Grid item xs={1.4}/>
                    </>
                    :
                    <Grid item xs={6.4}/>
            }

            <Grid item xs={0.6}/>
            <Grid item xs={1}><MailIcon/></Grid>
            <Grid item xs={4} zeroMinWidth>
                <Tooltip title={appointmentData.ownerEmail}>
                    <Typography noWrap>{appointmentData.ownerEmail}</Typography>
                </Tooltip>
            </Grid>

            {appointmentData.petAge?
                appointmentData.petColor?
                    <>
                        <Grid item xs={1}><PaletteIcon/></Grid>
                        <Grid item xs={4}>{appointmentData.petColor}</Grid>
                        <Grid item xs={1.4}/>
                    </>
                    :
                    <Grid item xs={6.4}/>
                :
                <Grid item xs={6.4}/>
            }
            {appointmentData.extraNotes?
                <>
                    <Grid item xs={0.6}/>
                    <Grid item xs={1}><TextSnippetIcon/></Grid>
                    <Grid item xs={10.4} zeroMinWidth>
                        {appointmentData.extraNotes}
                    </Grid>
                </>
                :
                <Grid item xs={12}/>
            }

        </Grid>
    </AppointmentTooltip.Content>
);


const classes = {
    todayCell: `todayCell`,
    today: `today`,
    commandButton: `commandButton`,
};

//--------------------------------------HEADER--------------------------------------------------------

const StyledIconButton = styled(IconButton)(() => ({
    [`&.${classes.commandButton}`]: {
        backgroundColor: "rgba(255,255,255,0.65)"
    }
}));
const StyledAppointmentTooltipHeader = styled(AppointmentTooltip.Header)(
    () => ({
        [`&.${classes.header}`]: {
            height: "260px",
            backgroundSize: "cover"
        }
    })
);

function CommandButton(props) {
    const { appointmentData, ...restProps } = props;
    const navigate = useNavigate();
    // let patientDetails = await appointmentData.exists.then((response)=>{return response.data});
    if (appointmentData.exists === true) {
        return (
            <>
                <StyledIconButton component={Link} to={"/medic/dashboard/patient-details/" + appointmentData.patientId}
                                  className={classes.commandButton}
                                  size="large"
                >
                    <AccountBoxIcon />
                </StyledIconButton>
            </> );

    }
    return (
        <>
            <StyledIconButton onClick={()=>navigate('/medic/dashboard/patient-form',{
                state: {
                    appointmentData: {
                        patientName:appointmentData.petName,
                        patientType:appointmentData.petType,
                        patientSex:appointmentData.petSex,
                        patientBreed:appointmentData.petBreed,
                        patientColour:appointmentData.petColour,
                        extraNotes:appointmentData.extraNotes,
                        ownerFirstName:appointmentData.ownerFirstName,
                        ownerLastName:appointmentData.ownerLastName,
                        ownerEmail:appointmentData.ownerEmail,
                        ownerAddress:appointmentData.ownerAddress,
                        ownerPhone:appointmentData.ownerPhone,
                    },
                    fromAppointments: true,
                }
            })}
                              className={classes.commandButton}
                              size="large"
            >
                <AddCircleIcon />
            </StyledIconButton>
        </>);
}


const Header = ({ children, appointmentData, ...restProps }) => (
    <StyledAppointmentTooltipHeader {...restProps} appointmentData={appointmentData}>
        <CommandButton appointmentData={appointmentData}/>
    </StyledAppointmentTooltipHeader>
);

//--------------------------------------TODAY-STYLE--------------------------------------------------------
const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
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
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
    }  return <StyledWeekViewTimeTableCell {...props} />;
};


//--------------------------------------CALENDAR--------------------------------------------------------

function Demo() {
    const getMonday = (d) => {
        const dt = new Date(d);
        const day = dt.getDay()
        const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(dt.setDate(diff));
    }

    const [appointments,setAppointments] = useState([]);
    const [procedures,setProcedures] = useState([]);
    const [currentDate,setCurrentDate] = useState(convertDate(getMonday(Date.now())));
    const [medicId,setMedicId] = useState(TokenService.getUser().id);

    const currentDateChange = (currentDate) => {
        setCurrentDate(convertDate(getMonday(currentDate)));
    };

    function getProcedure(id) {
        return procedures[0].instances.find(instance => instance.id === id);
    }

    function convertDate(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    function patientExists(appointment){

        const response = requestInstance.get(`http://localhost:8080/patient-exists?patientName=${appointment.patientName}&patientType=${appointment.patientType}&patientBreed=${appointment.patientBreed}&patientSex=${appointment.patientSex}&ownerEmail=${appointment.ownerEmail}`)
            .then((response) => {return response.data})
            .catch((error) => {console.log(error); return false;} );
        console.log(response)
        return response;
    }

    function fetchProcedures(){
        requestInstance.get(`http://localhost:8080/procedures`)
            .then((response) =>{
                return response.data;
            })
            .then(data => {
                const proceduresInstances = data.map(procedure => ({
                    id: procedure.id,
                    text: procedure.name,
                    duration: procedure.duration,
                }))
                const mappedProcedures = [{
                    fieldName: 'procedure',
                    title: 'Procedures',
                    instances: proceduresInstances,
                }];
                setProcedures(mappedProcedures);
            })
    }

    useEffect( () => {
        fetchProcedures();
    },[]);

    useEffect(() => {

        if (procedures.length === 0) {
            fetchProcedures();
        }
        else{
            requestInstance.get(`http://localhost:8080/appointments/weekly?medicId=${medicId}&date=${currentDate}`)
                .then((response) => {
                    return response.data;
                })
                .then(data => {
                    const appointments = data.map(async appointment => {
                        let exists = await patientExists(appointment).then((response)=>{return response.exists})
                        let patientId = await patientExists(appointment).then((response)=>{return response.patientId})
                        console.log(exists)
                        return ({
                            title: appointment.patientName + " " + getProcedure(appointment.procedureId).text,
                            startDate: appointment.dateReservation,
                            endDate: moment(appointment.dateReservation).add(getProcedure(appointment.procedureId).duration, 'minutes').toDate(),
                            id: appointment.id,
                            procedure: getProcedure(appointment.procedureId).id,
                            ownerFirstName: appointment.ownerFirstName,
                            ownerLastName: appointment.ownerLastName,
                            ownerPhone: appointment.ownerPhone,
                            ownerEmail: appointment.ownerEmail,
                            ownerAddress: appointment.ownerAddress,
                            petName: appointment.patientName,
                            petType: appointment.patientType,
                            petBreed: appointment.patientBreed,
                            petAge: appointment.patientAge,
                            petSex: appointment.patientSex,
                            petColour: appointment.patientColour,
                            extraNotes: appointment.extraNotes,
                            exists: exists,
                            patientId: patientId
                        });
                    })
                    return appointments;
                }).then(
                appointments => {
                    console.log(appointments);
                    let newAppointments = [];
                    appointments.forEach(appointment => {
                        newAppointments.push(appointment.then((response)=>{return response}));
                    })
                    Promise.all(newAppointments).then((response)=>{setAppointments(response)});
                }
            );
        }



    },[currentDate,procedures]);

    return (
        <React.Fragment>
            <Paper>
                <Scheduler
                    data={appointments}
                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={currentDateChange}
                    />
                    <Toolbar/>
                    <DateNavigator/>
                    <TodayButton/>
                    <WeekView
                        startDayHour={8}
                        endDayHour={18}
                        excludedDays={[0, 6]}
                        timeTableCellComponent={TimeTableCell}
                    />
                    <Appointments />
                    <AppointmentTooltip
                        contentComponent={Content}
                        headerComponent={Header}
                        showCloseButton
                        showCommandButton
                    />
                    <Resources
                        data={procedures}
                        palette={colorPalette}
                    />
                    <CurrentTimeIndicator
                        shadePreviousCells
                        shadePreviousAppointments
                    />
                </Scheduler>
            </Paper>
        </React.Fragment>
    );
}


export default Demo;
//Try to split this component, it's too big to be read and understand what it's does.