import React, { useRef,useEffect } from "react";
import InputField from "../utils/InputField";
import axios from "axios";
import { useNavigate,useParams } from "react-router";
const EditUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const img_UrlRef = useRef();
  //refField.current.value

  const getValueFromRef = (refField) => {
    return refField.current.value;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const firstName = getValueFromRef(firstNameRef);
    const lastName = getValueFromRef(lastNameRef);
    const email = getValueFromRef(emailRef);
    const img_Url = getValueFromRef(img_UrlRef);

    if (!(firstName && lastName && email)) {
      return;
    }

    axios
      .put("http://localhost:3000/users/"+id, {
        firstName,
        lastName,
        email,
        img_Url,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/users");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/users/"+id)
    .then((response)=>{
      const user=response.data
      firstNameRef.current.value=user.firstName
      lastNameRef.current.value=user.lastName
      emailRef.current.value=user.email
      img_UrlRef.current.value=user.img_Url
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <form
      className="grid grid-cols-2 gap-6 mb-6 2 pt-20"
      onSubmit={handleSubmit}
    >
      <InputField
        field={"firstName"}
        field_name={"First Name"}
        col_span={1}
        refField={firstNameRef}
      />
      <InputField
        field={"lastName"}
        field_name={"Last Name"}
        col_span={1}
        refField={lastNameRef}
      />
      <InputField field={"email"} field_name={"Email"} refField={emailRef} />
      <InputField
        field={"img_url"}
        field_name={"Profile Image"}
        col_span={2}
        refField={img_UrlRef}
      />
      <button className="bg-green-600 rounded-md p-2" type="submit">
        Submit
      </button>
    </form>
  );
};

export default EditUserForm;
