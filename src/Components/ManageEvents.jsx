import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  return (
    <>
      <SimpleHeader />
      <div>ONLY STAFF CAN ACCESS THIS, YOU CAN DELETE EVENTS</div>
    </>
  );
};

export default ManageEvents;
