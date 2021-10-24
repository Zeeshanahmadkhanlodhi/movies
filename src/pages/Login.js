import { Formik, Form } from "formik";
import React, { Fragment, useEffect } from "react";
import { InputField } from "./../components/InputField";
import { Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { toErrorMap } from "./../utils/toErrorMap";
const Login = (props) => {
  const { login, currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) history.push("/");
  }, [currentUser]);

  async function handleSubmit(values) {
    let errors = [];

    Object.keys(values).forEach((key) => {
      if (!values[key] && key !== "rememberMe")
        errors.push({ field: key, message: `${key} is Empty` });
    });
    try {
      if (!errors[0]) await login(values.email, values.password);

      return { errors };
    } catch (error) {
      console.log("asdmasd", error);
      if (error.message.includes("email"))
        errors.push({ field: "email", message: error.message });
      else if (
        error.message.includes("password") ||
        error.message.includes("Password")
      )
        errors.push({ field: "password", message: error.message });
      else if (error.message.includes("no user"))
        errors.push({ field: "email", message: error.message });
      else alert("Network error!");

      return { errors, user: null };
    }
  }
  return (
    <Fragment>
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
          <div className="col-xl-7 vh-100 align-items-center d-flex  bg-Pink  rounded-3 overflow-hidden">
            <div className="card bg-Pink  shadow-none border-0 ms-auto me-auto login-card">
              <Formik
                initialValues={{
                  password: "",
                  email: "",
                  rememberMe: false,
                }}
                onSubmit={async (values, { setErrors }) => {
                  const response = await handleSubmit(values);
                  if (response.errors[0])
                    setErrors(toErrorMap(response.errors));
                  else history.replace("/");
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="card-body  bg-Pink  rounded-0 text-left">
                      <h2 className="fw-700 display1-size display2-md-size mb-3">
                        Login
                      </h2>

                      <div className="form-group icon-input mb-3">
                        <i className="font-sm ti-email -500 pe-0"></i>
                        <InputField
                          name="email"
                          type="text"
                          className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                          placeholder="Your Email Address"
                        />
                      </div>
                      <div className="form-group icon-input mb-1">
                        <InputField
                          name="password"
                          type="Password"
                          className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                          placeholder="Password"
                        />
                        <i className="font-sm ti-lock  pe-0"></i>
                      </div>
                      <div className="form-check text-left mb-3">
                        <InputField
                          name="rememberMe"
                          type="checkbox"
                          className="form-check-input mt-2"
                        />
                        <label className="form-check-label font-xsss text-grey-500">
                          Remember me
                        </label>
                        <a
                          style={{ color: "red" }}
                          href="/forgot"
                          className="fw-600 font-xsss  mt-1  float-right"
                        >
                          Forgot your Password?
                        </a>
                      </div>

                      <div className="col-sm-12 p-0 text-left">
                        <div className="form-group mb-1">
                          {/* <a
                        href="/login"
                        className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                        >
                        Login
                      </a> */}
                          <div className="form-control text-center style2-input text-white fw-600 bg-red border-0 p-0 ">
                            {isSubmitting ? (
                              <Spinner animation="border" />
                            ) : (
                              <Button
                                className="form-control text-center style2-input text-white fw-600 bg-red border-0 p-0"
                                type="submit"
                              >
                                Login
                              </Button>
                            )}
                          </div>
                        </div>
                        <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">
                          Dont have account{" "}
                          <a
                            href="/register"
                            style={{ color: "red" }}
                            className="fw-700 ms-1"
                          >
                            Register
                          </a>
                        </h6>
                      </div>
                      {/* <div className="col-sm-12 p-0 text-center mt-2">
                    <h6 className="mb-0 d-inline-block bg-white fw-500 font-xsss text-grey-500 mb-3">
                    Or, Sign in with your social account{" "}
                    </h6>
                    <div className="form-group mb-1">
                    <a
                    href="/register"
                    className="form-control text-left style2-input text-white fw-600 bg-facebook border-0 p-0 mb-2"
                    >
                    <img
                    src="assets/images/icon-1.png"
                    alt="icon"
                    className="ms-2 w40 mb-1 me-5"
                    />{" "}
                    Sign in with Google
                    </a>
                    </div>
                    <div className="form-group mb-1">
                    <a
                    href="/register"
                    className="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "
                    >
                    <img
                    src="assets/images/icon-3.png"
                    alt="icon"
                    className="ms-2 w40 mb-1 me-5"
                    />{" "}
                    Sign in with Facebook
                    </a>
                    </div>
                  </div> */}
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

export default Login;
