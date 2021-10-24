import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Appfooter from "../components/Appfooter";
import Createpost from "../components/Createpost";
import Load from "../components/Load";
import Popupchat from "../components/Popupchat";
import ProfilecardThree from "../components/ProfilecardThree";
import Profiledetail from "../components/Profiledetail";
import Rightchat from "../components/Rightchat";
import Post from "./../components/Post";
import { useAuth } from "./../context/AuthContext";
import { db, storage } from "./../firebase";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Formik, Form } from "formik";
import { InputField } from "./../components/InputField";
import { Spinner, Button } from "react-bootstrap";
import Dropzone from "./../components/Dropzone";
import AsyncButton from "./../components/AsyncButton";
import moment from "moment";
import { toErrorMap } from "./../utils/toErrorMap";

const CreateHouse = () => {
  const [postsList, setPostsList] = useState([]);
  const [friendssList, setFriendsList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [pageState, setPageState] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(null);
  const { currentUser } = useAuth();
  const history = useHistory();
  const match = useRouteMatch();
  const [otherUser, setOtherUser] = useState(null);
  const [houseImage, setHouseImage] = useState(
    "https://via.placeholder.com/1200x250.png"
  );
  const [houseDes, setHouseDes] = useState("No description");
  const imageFile = useRef(null);
  const [edit, setEdit] = useState(false);

  async function handleImageSubmit(file) {
    imageFile.current = file;
    setFetching(true);
    return new Promise((resolve, reject) => {
      const uploadTask = storage.ref(`/house/images/${file.name}`).put(file);

      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log(snapShot);
        },
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("house/images")
            .child(file.name)
            .getDownloadURL()
            .then(async (fireBaseUrl) => {
              setHouseImage(fireBaseUrl);
              setFetching(false);
              resolve();
            })
            .catch((err) => {
              setFetching(false);
              console.log(err);
              reject();
            });
        }
      );
    });
  }

  useEffect(() => {
    db.child("user")
      .child(currentUser?.id)
      .child("friends")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("post dataasdas", snapshot.val());
          let valuesList = Object.values(snapshot.val());

          setFriendsList(valuesList.map(({ name }) => name));
        } else {
          console.log("No data available");
        }
        // setFetching(false);
      });
  }, []);

  async function handleSubmit(values) {
    return new Promise((resolve, reject) => {
      let errors = [];

      Object.keys(values).forEach((key) => {
        if (!values[key] && key !== "privacy")
          errors.push({ field: key, message: `${key} is Empty` });
      });
      var newPostKey = db.child("posts").push().key;
      let houseInfo = {
        id: newPostKey,
        creator: currentUser.id,
        about: houseDes,
        thumbnail: houseImage,
        creationDt: moment().unix(),
        members: values.friends,
        privacy: values.privacy,
        name: values.name,
      };
      if (!errors[0]) {
        db.child("user")
          .child(currentUser.id)
          .child("houses")
          .child(newPostKey)
          .set(newPostKey)
          .then(() => {
            db.child("houses")
              .child(newPostKey)
              .child("houseInfo")
              .set(houseInfo)
              .then(() => resolve({ errors, houseInfo }))
              .catch((err) => {
                console.log(err);
                resolve({ errors });
              });
          })
          .catch((err) => {
            console.log(err);
            resolve({ errors });
          });
      } else resolve({ errors });
    });
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-4 mb-3">
          <div className="shadow-none border-0  ">
            <Formik
              initialValues={{
                name: "",
                privacy: "Everyone",
                friends: [],
              }}
              onSubmit={async (values, { setErrors }) => {
                const response = await handleSubmit(values);
                console.log("asjdaksdnas", response);
                if (response.errors[0]) setErrors(toErrorMap(response.errors));
                else if (response.houseInfo)
                  history.push(
                    `/house/${values.name}/${response.houseInfo.id}`
                  );
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <div className="card-body rounded-0 text-left">
                    <h2 className="fw-700 font-xl display2-md-size mb-4">
                      Create House
                    </h2>

                    <div className=" mb-3">
                      <InputField
                        name="name"
                        type="text"
                        className="style2-input  form-control text-grey-900 font-xsss fw-600"
                        placeholder="House Name"
                      />
                    </div>
                    <div className=" mb-3">
                      <InputField
                        name="privacy"
                        select
                        listData={["Everyone"]}
                        className="style2-input form-control text-grey-900 font-xsss fw-600"
                        placeholder="Choose Privacy"
                      />
                    </div>
                    <div className=" mb-3">
                      <InputField
                        name="friends"
                        select
                        listData={friendssList}
                        className="style2-input  form-control text-grey-900 font-xsss fw-600"
                        placeholder="Invite Friends"
                      />
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
                              Create House
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
        <div className="col-xl-8 mb-3">
          <div className="row">
            <div className="col-xl-12 mb-3">
              <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
                <Dropzone
                  setImage={setHouseImage}
                  dragable={false}
                  formField={false}
                  handleSubmit={handleImageSubmit}
                >
                  <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3">
                    <img src={houseImage} alt="avater" />
                  </div>
                </Dropzone>
                <div className="card-body p-0 position-relative">
                  <h4 className="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15">
                    House Name
                  </h4>
                  <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
                    <AsyncButton className="d-none d-lg-block bg-success p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3 hoverBtn">
                      <span>Delete</span>
                    </AsyncButton>
                  </div>
                </div>

                <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                  <ul
                    className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="active list-inline-item me-5">
                      <a
                        className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active"
                        href="#navtabs1"
                        data-toggle="tab"
                      >
                        About
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
              <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                <div className="card-body d-block p-4">
                  <h4 className="fw-700 mb-3 font-xsss text-grey-900">About</h4>
                  {edit ? (
                    <Formik
                      initialValues={{
                        discription: houseDes,
                      }}
                      onSubmit={async (
                        values,
                        { setErrors, setFieldValue }
                      ) => {
                        setHouseDes(values.discription);
                        setEdit(false);
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
                        {houseDes}.{" "}
                        <img
                          src={require("../../public/assets/images/icons/pencil.png")}
                          style={{ marginLeft: "10px", height: "15px" }}
                          onClick={() => setEdit(true)}
                        />
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateHouse;
