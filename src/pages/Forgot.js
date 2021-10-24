import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { InputField } from "./../components/InputField";
import { toErrorMap } from "./../utils/toErrorMap";
import { useAuth } from "./../context/AuthContext";
import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";

const Forgot = () => {
  const { resetPassword } = useAuth();
  const history = useHistory();

  async function handleSubmit(values) {
    let errors = [];

    Object.keys(values).forEach((key) => {
      if (!values[key]) errors.push({ field: key, message: `${key} is Empty` });
    });
    try {
      await resetPassword(values.email);
      return { errors };
    } catch (error) {
      console.log("asdddddmasd", error);
      if (error.message.includes("email"))
        errors.push({ field: "password", message: error.message });
      return { errors };
    }
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Password Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>Check your inbox for further instructions!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => history.push("/login")}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="main-wrap">
        <div className="nav-header bg-transparent shadow-none border-0">
          <div className="nav-top w-100">
            <img
              src="assets/images/sammartin391-1.png"
              style={{ width: "250px" }}
            />
            <button className="nav-menu me-0 ms-auto"></button>

            <a
              href="/login"
              className=" fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl"
            ></a>
            <a
              href="/register"
              className=" fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl"
            ></a>
          </div>
        </div>

        <div className="row">
          <div
            className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
            style={{
              backgroundImage: `url("https://via.placeholder.com/800x950.png")`,
            }}
          ></div>

          <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
            <div className="card shadow-none border-0 ms-auto me-auto login-card">
              <Formik
                initialValues={{
                  email: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                  const response = await handleSubmit(values);
                  if (response.errors[0])
                    setErrors(toErrorMap(response.errors));
                  else handleShow();
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="card-body rounded-0 text-left">
                      <h2 className="fw-700 display1-size display2-md-size mb-4">
                        Password Reset
                      </h2>
                      <div className="form-group icon-input mb-3">
                        <InputField
                          name="email"
                          type="text"
                          className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                          placeholder="Your Email Address"
                        />
                        <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                      </div>

                      <div className="col-sm-12 p-0 text-left">
                        <div className="form-group mb-1">
                          <div className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                            {isSubmitting ? (
                              <Spinner animation="border" />
                            ) : (
                              <Button
                                className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0"
                                type="submit"
                              >
                                Change Password
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Forgot;
