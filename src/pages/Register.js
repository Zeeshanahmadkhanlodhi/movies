import { Form, Formik } from "formik";
import React, { Fragment } from "react";
import { Spinner, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { InputField } from "./../components/InputField";
import { useAuth } from "./../context/AuthContext";
import { toErrorMap } from "./../utils/toErrorMap";
import { db } from "./../firebase";
import '../style/responsiveness.css'

const Register = (props) => {
  const { signup } = useAuth();
  const history = useHistory();

  async function handleSubmit(values) {
    let errors = [];

    Object.keys(values).forEach((key) => {
      if (!values[key]) errors.push({ field: key, message: `${key} is Empty` });
    });

    if (values.password !== values.confirmPassword) {
      errors.push({ field: "password", message: "Passwords do not match" });
    }
    try {
      let authUser = await signup(values.email, values.password);
      let userInfo = {
        id: authUser.user.uid,
        name: values.name,
        email: values.email,
        age: values.age,
        gender: values.gender,
        thumbnail:
          "https://firebasestorage.googleapis.com/v0/b/movieshare-b1ce3.appspot.com/o/user%2Fpngegg.png?alt=media",
        stubs: 0,
        about: "No description",
      };
      if (!errors[0])
        await db
          .child("user")
          .child(authUser.user.uid)
          .child("UserInfo")
          .set(userInfo);
      return { errors, user: userInfo };
    } catch (error) {
      console.log("asdmasd", error);
      if (error.message.includes("email"))
        errors.push({ field: "email", message: error.message });
      else if (
        error.message.includes("password") ||
        error.message.includes("Password")
      )
        errors.push({ field: "password", message: error.message });
      return { errors, user: null };
    }
  }

  return (
    <Fragment>
      <div className="main-wrap">
        <div className="nav-header  bg-transparent shadow-none border-0">
          <div className="nav-top w-100">
            <img
              src="assets/images/sammartin391-1.png"
              style={{ width: "250px" }}
            />
            <button className="nav-menu me-0 ms-auto"></button>

            {/* <a
                href="/login"
                className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl"
              >
                Login
              </a>
              <a
                href="/register"
                className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl"
              >
                Register
              </a> */}
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
          <div className="col-xl-7 vh-100 align-items-center d-flex bg-Pink rounded-3 overflow-hidden">
            <div className="card shadow-none border-0 ms-auto bg-Pink  me-auto login-card">
              <Formik
                initialValues={{
                  password: "",
                  email: "",
                  policycheck: false,
                  name: "",
                  confirmPassword: "",
                  age: "",
                  gender: "Male",
                }}
                onSubmit={async (values, { setErrors }) => {
                  // const response = await registerUser(values);
                  // if (response.errors) setErrors(toErrorMap(response.errors));
                  // else if (response.user) router.push("/");
                  const response = await handleSubmit(values);
                  console.log("asddddmasd", response);
                  if (response.errors[0])
                    setErrors(toErrorMap(response.errors));
                  else if (response.user) history.replace("/");
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="card-body bg-Pink  rounded-0 text-left">
                      <h2 className="fw-700 font-xxl display2-md-size mb-4">
                        Create your account
                      </h2>

                      <div className="form-group icon-input mb-3">
                        <i className="font-sm ti-user  pe-0"></i>
                        <InputField
                          name="name"
                          type="text"
                          min={10}
                          className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                          placeholder="User Name"
                        />
                      </div>
                      <div className="form-group icon-input mb-3">
                        <i className="font-sm ti-email  pe-0"></i>
                        <InputField
                          name="email"
                          type="text"
                          className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                          placeholder="Your Email Address"
                        />
                      </div>
                      <div className="d-flex">
                        <div className="form-group icon-input mb-3">
                          <i>
                            <img
                              src={require("../../public/assets/images/icons/age.png")}
                              style={{ width: "20px", marginRight: "20px" }}
                            />
                          </i>
                          <InputField
                            name="age"
                            type="number"
                            min="10"
                            style={{ width: "96%" }}
                            className=" style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                            placeholder="Age"
                          />
                        </div>
                        <div className="form-group icon-input mb-3">
                          {/* <i class="fal fa-venus-mars"></i> */}
                          <i>
                            <img
                              src={require("../../public/assets/images/icons/Gender.png")}
                              style={{ width: "20px", marginRight: "20px" }}
                            />
                          </i>
                          <InputField
                            name="gender"
                            className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                            // placeholder="Gender"
                            select
                            listData={["Male", "Female"]}
                          />
                        </div>
                      </div>
                      <div className="form-group icon-input mb-3">
                        <InputField
                          name="password"
                          type="Password"
                          className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                          placeholder="Password"
                        />
                        <i className="font-sm ti-lock  pe-0"></i>
                      </div>
                      <div className="form-group icon-input mb-1">
                        <InputField
                          name="confirmPassword"
                          type="Password"
                          className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                          placeholder="Confirm Password"
                        />
                        <i className="font-sm ti-lock pe-0"></i>
                      </div>
                      <div className="form-check text-left mb-3">
                        <InputField
                          name="policycheck"
                          type="checkbox"
                          className="form-check-input mt-2"
                          id="exampleCheck2"
                        />
                        <label className="form-check-label font-xsss text-grey-500">
                          Accept Term and Conditions
                        </label>
                      </div>

                      <div className="col-sm-12 p-0 text-left">
                        <div className="form-group mb-1">
                          {/* <a
                            href="/register"
                            className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                          >
                            Register
                          </a> */}
                          <div className="form-control text-center style2-input text-white fw-600 bg-red border-0 p-0 ">
                            {isSubmitting ? (
                              <Spinner animation="border" />
                            ) : (
                              <Button
                                className="form-control text-center style2-input text-white fw-600 bg-red border-0 p-0"
                                type="submit"
                              >
                                Register
                              </Button>
                            )}
                          </div>
                        </div>
                        <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">
                          Already have account{" "}
                          <a href="/login" className="fw-700 ms-1">
                            Login
                          </a>
                        </h6>
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

export default Register;
