import React from "react";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {Sidebar, Menu, MenuItem, useProSidebar, ProSidebarProvider} from "react-pro-sidebar";
import {Link, Outlet} from "react-router-dom";
import "./MedicDashboard.css"

function MedicDashboard() {
    const {collapseSidebar} = useProSidebar();

    return (

        <div className="medic-dashboard">
            <Sidebar className="medic-sidebar">
                <Menu>
                    <MenuItem
                        className="medic-sidebar-header"
                        icon={<MenuOutlinedIcon/>}
                        onClick={() => {
                            collapseSidebar();
                        }}
                        style={({textAlign: "center"})}
                    >
                        {" "}
                        <h2>Medic</h2>
                    </MenuItem>
                    <MenuItem icon={<CalendarTodayIcon/>}
                              component={<Link to="/medic/dashboard/calendar"/>}
                    >Calendar</MenuItem>

                    <MenuItem icon={<PeopleOutlinedIcon/>}
                              component={<Link to="/medic/dashboard/patients"/>}>
                        Patients
                    </MenuItem>

                    <MenuItem icon={<PersonAddAltIcon/>}
                              component={<Link to="/medic/dashboard/patient-form"/>}>
                        Add patient
                    </MenuItem>
                </Menu>
            </Sidebar>
            <main className="medic-component">
                <Outlet/>
            </main>
        </div>
    );
}

export default MedicDashboard;
