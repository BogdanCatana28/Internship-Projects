import React, { useEffect, useState } from 'react'
import RequestInstance from "../../utils/RequestInstance";

function Procedures() {

    const [procedures, setProcedures] = useState([]);
 
    useEffect( () => {
        loadProcedures();
    }, [])

    const loadProcedures = async () => {
        const result = await RequestInstance.get("http://localhost:8080/procedures");
        setProcedures(result.data);
    }

  return (
    <div className='container'>
        <div className='py-4'>
            <table className="table border shadow">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Price</th>
                    <th scope="col">Specializations</th>
                    <th scope="col">Anesthesia</th>
                  </tr>
                </thead>
                <tbody>

                    {
                        procedures.map((procedure, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{procedure.name}</td>
                                <td>{procedure.duration}</td>
                                <td>{procedure.price}</td>
                                <td>{procedure.specializations}</td>
                                <td>{procedure.anesthesia ? "Yes" : "No"}</td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    </div>

  )
}

export default Procedures

//Try to use only arrow function or functions.