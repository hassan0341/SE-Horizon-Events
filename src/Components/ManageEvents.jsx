import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const ManageEvents = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
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
        navigate("/unauthorized");
      }
      setLoading(false);
    };
    checkAccess();
  }, [navigate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <SimpleHeader />
          <div>ONLY STAFF CAN ACCESS THIS, YOU CAN CREATE EVENTS</div>
        </>
      )}
    </>
  );
};

export default ManageEvents;
