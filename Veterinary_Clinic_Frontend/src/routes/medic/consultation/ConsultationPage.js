import ConsultationPageForm from "./ConsultationPageForm";
import React, {useEffect, useState} from "react";
import TokenService from "../../../services/TokenService";
import RequestInstance from "../../../utils/RequestInstance";
import {useParams} from "react-router-dom";
import TimedPopup from "../../../components/popup/TimedPopup";

export default function ConsultationPage() {
    const [data, setData] = useState(null);

    const user = TokenService.getUser();
    //remove the variables what you don't use
    const { id } = useParams();

    console.log("id:");
    console.log(id);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupMessageType, setPopupMessageType] = useState("");

    useEffect(() => {
        console.log("apel");
        const boi = RequestInstance.get(`http://localhost:8080/patients/${id}`)
            .then(response => {
                // if (!response.ok) {
                //   throw new Error('Network response was not ok');
                // }
                console.log("data1");
                console.log(response.data);
                setData(response.data)
                return response.data;
            })

            .catch(error => {
                console.error('Error fetching user:', error);
            });

        const boi2 = async () => {
            const a = await boi;
            console.log("a:")
            console.log(a)
            setData(a);
            console.log("data3");
            console.log(data);
        }

        boi2();
    }, []);

    console.log("after"); //AccountPageForm preloadedData={data}

    return (
        data ?
            <>
                <ConsultationPageForm preloadedData={data}/>
            {/*    why form get data*/}
            </>
            :
            <div>Loading...</div>

    //todo     add some loading animation + error handling if not loaded
        // todo if he modifies fields from the patient form, they should update in bd
    );
}