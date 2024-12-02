import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === "Staff Member") {
          console.log("access granted");
        } else {
          console.log("Access Denied");
          navigate("/");
        }
      } else {
        console.log("No user logged in");
        navigate("/auth");
      }
    };
    checkAccess();
  }, [navigate]);

  return (
    <>
      <SimpleHeader />
      <div>ONLY STAFF CAN ACCESS THIS, YOU CAN DELETE EVENTS</div>
    </>
  );
};

export default ManageEvents;
