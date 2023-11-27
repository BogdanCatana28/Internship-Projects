import React, { useEffect, useState } from "react";
import "./AccountPage.css"
import TokenService from "../../services/TokenService";
import RequestInstance from "../../utils/RequestInstance"
import { PreferencesForm } from "./PreferencePageForm";

export function PreferencePage() {
    const [data, setData] = useState(null);
    const user = TokenService.getUser();
    const [reload,setReload] = useState(false);

    useEffect(() => {
        const boi = RequestInstance.get(`http://localhost:8080/user-preferences/customer/${user.id}`)
            .then(response => {
                // if (!response.ok) {
                //   throw new Error('Network response was not ok');
                // }
                console.log("data1");
                console.log(response.data);
                return response.data;
            })

            .catch(error => {
                console.error('Error fetching user:', error);
            });

        const boi2 = async () => {
            const a = await boi;
            setData(a);
            console.log("data3");
            console.log(data);
        }

        boi2();
        setReload(false)
    }, [reload]);

    return (
        data ?
            <>
                <div className="preferences-container">
                    <PreferencesForm preloadedData={data} setReload={setReload}/>
                </div>
            </>
            :
            <div>Loading...</div>
    );
};

export default PreferencePage;
