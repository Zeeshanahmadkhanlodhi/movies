import React, { useState } from "react";
import { Formik, Form } from "formik";
import { InputField } from "./InputField";
import { toErrorMap } from "./../utils/toErrorMap";
import { Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useAuth } from "./../context/AuthContext";
import { db } from "./../firebase";

const Profiledetail = (props) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [edit, setEdit] = useState(false);

  async function handleSubmit(values) {
    return new Promise((resolve, reject) => {
      let errors = [];
      Object.keys(values).forEach((key) => {
        if (values[key] === "")
          errors.push({ field: key, message: `${key} is Empty` });
      });
      if (errors.length == 0)
        db.child("user")
          .child(currentUser?.id)
          .child("UserInfo")
          .child("about")
          .set(values.discription)
          .then(() => {
            setCurrentUser({ ...currentUser, about: values.discription });
            resolve({ errors });
          })
          .catch(() => {
            reject({ errors });
          });
      else resolve({ errors });
    });
  }

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-block p-4">
        <h4 className="fw-700 mb-3 font-xsss text-grey-900">About</h4>
        {edit && !props.otherUser ? (
          <Formik
            initialValues={{
              discription: currentUser?.about,
            }}
            onSubmit={async (values, { setErrors, setFieldValue }) => {
              const response = await handleSubmit(values);
              if (response.errors[0]) {
                setErrors(toErrorMap(response.errors));
                //alert(response.errors[0].message);
              } else setEdit(false);
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <div className="card-body p-0 mt-3 position-relative">
                  <InputField
                    name="discription"
                    className="h100 bor-0 w-100 rounded-xxl p-2  font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
                    cols="30"
                    rows="10"
                    placeholder="What's on your mind?"
                    textarea
                  />
                </div>
                <div className="card-body d-flex p-0 mt-0">
                  {isSubmitting ? (
                    <div
                      className="live-tag mt-2 mb-0 bg-danger p-2 z-index-1 rounded-3 text-white font-xsssss text-uppersace fw-700 ls-3 ms-auto text-center"
                      style={{ width: "100px" }}
                    >
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <Button
                      className="live-tag  submitbtnstyle mt-2 mb-0 bg-danger p-2 z-index-1 rounded-3 text-white font-xsssss text-uppersace fw-700 ls-3 ms-auto text-center"
                      style={{ width: "100px" }}
                      type="submit"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div style={{ display: "flex" }}>
            <p className="fw-500 text-grey-500 lh-24 font-xssss mb-0">
              {props.otherUser ? props.otherUser?.about : currentUser?.about}.{" "}
              {!props.otherUser && (
                <img
                  src={require("../../public/assets/images/icons/pencil.png")}
                  style={{ marginLeft: "10px", height: "15px" }}
                  onClick={() => setEdit(true)}
                />
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiledetail;
