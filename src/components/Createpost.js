import React, { useState } from "react";
import { Formik, Form } from "formik";
import { InputField } from "./InputField";
import { toErrorMap } from "./../utils/toErrorMap";
import { Modal } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Dropzone from "./Dropzone";
import { storage, db } from "./../firebase";
import { useAuth } from "./../context/AuthContext";
import moment from "moment";

const Createpost = () => {
  const [postImage, setPostImage] = useState(null);
  const { currentUser } = useAuth();

  const handleSubmitOut = async (values) => {
    let errors = [];
    console.log("aslkndas,ldknsadas", values);
    Object.keys(values).forEach((key) => {
      if (values[key] === "")
        errors.push({ field: key, message: `${key} is Empty` });
    });
    try {
      if (!errors[0]) {
        var newPostKey = await db.child("posts").push().key;
        let postInfo = {
          id: newPostKey,
          user: currentUser.id,
          description: values.discription,
          thumbnail: "",
          creationDt: moment().unix(),
          likes: 0,
          share: 0,
          comments: 0,
          stubs: 0,
        };
        await db
          .child("user")
          .child(currentUser.id)
          .child("posts")
          .child(newPostKey)
          .set(newPostKey);
        await db
          .child("posts")
          .child(newPostKey)
          .child("postInfo")
          .set(postInfo);
      }
      return { errors };
    } catch (error) {
      errors.push({ field: "discription", message: error.message });
      return { errors };
    }
  };

  async function handleSubmit(values) {
    return new Promise((resolve, reject) => {
      let errors = [];

      Object.keys(values).forEach((key) => {
        if (!values[key] && key !== "thumbnail" && key !== "video")
          errors.push({ field: key, message: `${key} is Empty` });
      });
      if (!postImage) {
        errors.push({
          field: "thumbnail",
          message: `not an image, the image file is a ${typeof postImage}`,
        });
      }
      const uploadTask = storage
        .ref(`/posts/images/${postImage.name}`)
        .put(postImage);

      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log(snapShot);
        },
        (err) => {
          console.log(err);
          reject({ errors });
        },
        () => {
          storage
            .ref("posts/images")
            .child(postImage.name)
            .getDownloadURL()
            .then(async (fireBaseUrl) => {
              var newPostKey = db.child("posts").push().key;
              let postInfo = {
                id: newPostKey,
                user: currentUser.id,
                description: values.discription,
                thumbnail: fireBaseUrl,
                creationDt: moment().unix(),
                likes: 0,
                share: 0,
                comments: 0,
                stubs: 0,
              };
              await db
                .child("user")
                .child(currentUser.id)
                .child("posts")
                .child(newPostKey)
                .set(newPostKey)
                .catch((err) => console.log(err));
              await db
                .child("posts")
                .child(newPostKey)
                .child("postInfo")
                .set(postInfo)
                .catch((err) => console.log(err));
              resolve({ errors });
            })
            .catch((err) => {
              console.log(err);
              reject({ errors });
            });
        }
      );
    });
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            discription: "",
            thumbnail: null,
            video: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            console.log("asldnakjsdnasd", values, postImage);
            const response = await handleSubmit(values);
            if (response.errors[0]) setErrors(toErrorMap(response.errors));
            else handleClose();
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Modal.Body>
                <InputField
                  name="discription"
                  className="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
                  cols="30"
                  rows="10"
                  placeholder="What's on your mind?"
                  textarea
                />
                <Dropzone name="thumbnail" setImage={setPostImage} />
              </Modal.Body>
              <Modal.Footer>
                {isSubmitting ? (
                  <div
                    className="live-tag mt-2 mb-0 bg-danger p-2 z-index-1 rounded-3 text-white font-xsssss text-uppersace fw-700 ls-3 ms-auto text-center"
                    style={{ width: "100px" }}
                  >
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : (
                  <Button
                    className="live-tag mt-2 submitbtnstyle mb-0 bg-danger p-2 z-index-1 rounded-3 text-white font-xsssss text-uppersace fw-700 ls-3 ms-auto text-center"
                    style={{ width: "100px" }}
                    type="submit"
                  >
                    Post
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Formik
        initialValues={{
          discription: "",
        }}
        onSubmit={async (values, { setErrors, setFieldValue }) => {
          const response = await handleSubmitOut(values);
          if (response.errors[0]) {
            setErrors(toErrorMap(response.errors));
            alert(response.errors[0].message);
          }
          setFieldValue("discription", "");
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div
                className="card-body p-0 col-12 col-sm-12"
                style={{ display: "flex" }}
              >
                <a
                  className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
                  onClick={handleShow}
                >
                  <i className="btn-round-sm font-xs text-primary feather-edit-3 me-2 bg-greylight"></i>
                  Create Post
                </a>
                {/* <a
                  href="/"
                  className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
                >
                  <i className="btn-round-sm font-xs text-primary feather-edit-3 me-2 bg-greylight"></i>
                  Create PayWall
                </a> */}
              </div>
              <div className="card-body p-0 mt-3 position-relative">
                <figure className="avatar position-absolute ms-2 mt-1 top-5">
                  <img
                    src="assets/images/user.png"
                    alt="icon"
                    className="shadow-sm rounded-circle w30"
                  />
                </figure>
                <InputField
                  name="discription"
                  className="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
                  cols="30"
                  rows="10"
                  placeholder="What's on your mind?"
                  textarea
                />
              </div>
              <div className="card-body d-flex p-0 mt-0">
                <a
                  href="#photo"
                  onClick={handleShow}
                  className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
                >
                  <i className="font-md text-success feather-image me-2"></i>
                  <span className="d-none-xs">Photo/Video</span>
                </a>
                <a
                  href="#video"
                  className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
                >
                  <img
                    src={require("../../public/assets/images/icons/Watching.png")}
                    style={{ width: "20px", marginRight: "10px" }}
                  />
                  <span className="d-none-xs">Watching</span>
                </a>
                {/* <a href="#activity" className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"><i className="font-md text-warning feather-camera me-2"></i><span className="d-none-xs">Feeling/Activity</span></a> */}
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
                    Post
                  </Button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Createpost;
