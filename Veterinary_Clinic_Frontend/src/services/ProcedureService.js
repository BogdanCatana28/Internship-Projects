import api from "./Api";
import requestInstance from "../utils/RequestInstance";

const showProcedures = () => {
    return requestInstance.get("http://localhost:8080/procedures");
};

const addProcedure = (procedure) => {
    return requestInstance.post("http://localhost:8080/procedures", procedure);
};

const showProcedureById = (id) => {
    return requestInstance.get(`http://localhost:8080/procedures/${id}`);
};

const updateProcedure = (procedure, id) => {
    return requestInstance.put(`http://localhost:8080/procedures/${id}`, procedure);
  };

const deleteProcedure = (id) => {
    return requestInstance.delete(`http://localhost:8080/procedures/${id}`);
  };

const ProcedureService = {
  showProcedures,
  addProcedure,
  showProcedureById,
  updateProcedure,
  deleteProcedure
};

export default ProcedureService;