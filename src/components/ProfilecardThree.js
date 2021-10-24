import React, { Component, useState, useEffect } from "react";
import { useAuth } from "./../context/AuthContext";
import Dropzone from "./Dropzone";
import { db, storage } from "./../firebase";
import { Spinner } from "react-bootstrap";
import AsyncButton from "./AsyncButton";
import "../../new.css";

const ProfilecardThree = (props) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("Add Friend");

  async function handleSubmit(file) {
    setFetching(true);
    return new Promise((resolve, reject) => {
      const uploadTask = storage.ref(`/user/images/${file.name}`).put(file);

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
            .ref("user/images")
            .child(file.name)
            .getDownloadURL()
            .then(async (fireBaseUrl) => {
              db.child("user")
                .child(currentUser?.id)
                .child("UserInfo")
                .child("thumbnail")
                .set(fireBaseUrl)
                .then(() => {
                  setProfileImage(fireBaseUrl);
                  setCurrentUser({ ...currentUser, thumbnail: fireBaseUrl });
                  setFetching(false);
                  resolve();
                })
                .catch(() => {
                  setFetching(false);
                  reject();
                });
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

  const handleFriendRequest = () => {
    return new Promise((resolve, reject) => {
      setRequestLoading(true);
      db.child("user")
        .child(currentUser?.id)
        .child("friendRequests")
        .child("sent")
        .child(props.otherUser?.id)
        .set({
          userId: props.otherUser?.id,
          status: "pending",
        })
        .then(() => {
          db.child("user")
            .child(props.otherUser?.id)
            .child("friendRequests")
            .child("recived")
            .child(currentUser?.id)
            .set({
              userId: currentUser?.id,
              status: "pending",
            })
            .then(() => {
              setRequestStatus("Requested");
              setRequestLoading(false);
              resolve();
            })
            .catch(() => {
              reject();
              setRequestLoading(false);
            });
        })
        .catch(() => {
          reject();
          setRequestLoading(false);
        });
    });
  };

  const unFriend = () => {
    return new Promise((resolve, reject) => {
      setRequestLoading(true);
      db.child("user")
        .child(currentUser?.id)
        .child("friends")
        .child(props.otherUser.id)
        .remove()
        .then(() => {
          db.child("user")
            .child(props.otherUser?.id)
            .child("friends")
            .child(currentUser?.id)
            .remove()
            .then(() => {
              db.child("user")
                .child(currentUser?.id)
                .child("friends")
                .child(props.otherUser?.id)
                .remove()
                .then(() => {
                  setRequestStatus("Add Friend");
                  resolve();
                })
                .catch(() => reject())
                .finally(() => setRequestLoading(false));
            })
            .catch(() => {
              reject();
              setRequestLoading(false);
            });
        })
        .catch(() => {
          reject();
          setRequestLoading(false);
        });
    });
  };

  const cancelRequest = () => {
    return new Promise((resolve, reject) => {
      setRequestLoading(true);
      db.child("user")
        .child(currentUser?.id)
        .child("friendRequests")
        .child("sent")
        .child(props.otherUser?.id)
        .remove()
        .then(() => {
          db.child("user")
            .child(props.otherUser?.id)
            .child("friendRequests")
            .child("recived")
            .child(currentUser?.id)
            .remove()
            .then(() => {
              setRequestStatus("Add Friend");
              setRequestLoading(false);
              resolve();
            })
            .catch(() => {
              reject();
              setRequestLoading(false);
            });
        })
        .catch(() => {
          reject();
          setRequestLoading(false);
        });
    });
  };

  useEffect(() => {
    setProfileImage(
      props.otherUser ? props.otherUser?.thumbnail : currentUser?.thumbnail
    );
    if (props.otherUser) {
      setRequestLoading(true);
      db.child("user")
        .child(currentUser?.id)
        .child("friends")
        .child(props.otherUser.id)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            setRequestStatus("Friend");
            setRequestLoading(false);
          } else
            db.child("user")
              .child(currentUser?.id)
              .child("friendRequests")
              .child("sent")
              .child(props.otherUser.id)
              .get()
              .then((snapshot) => {
                if (snapshot.exists()) setRequestStatus("Requested");
                setRequestLoading(false);
              })
              .catch(() => {
                setRequestLoading(false);
              });
        });
    }
  }, [currentUser, props.otherUser]);

  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      <div className="card-body p-0 position-relative">
        {!props.otherUser ? (
          <Dropzone
            setImage={setProfileImage}
            dragable={false}
            formField={false}
            handleSubmit={handleSubmit}
          >
            <figure
              className="avatar position-absolute w100 z-index-1"
              style={{ left: "30px" }}
            >
              {fetching ? (
                <Spinner animation="border" />
              ) : (
                <img
                  src={profileImage}
                  alt="avater"
                  className="float-right p-1 bg-white rounded-circle w-100"
                />
              )}
            </figure>
          </Dropzone>
        ) : (
          <figure
            className="avatar position-absolute w100 z-index-1"
            style={{ left: "30px" }}
          >
            <img
              src={profileImage}
              alt="avater"
              className="float-right p-1 bg-white rounded-circle w-100"
            />
          </figure>
        )}

        <h4 className="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15">
          {props.otherUser ? props.otherUser?.name : currentUser?.name}
          <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">
            {props.otherUser ? props.otherUser?.email : currentUser?.email}
          </span>
        </h4>
        {props.otherUser && (
          <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
            {/* <a
              href="/defaultmember"
              className="d-none d-lg-block bg-success p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3"
            >
              Add Friend
            </a> */}

            <AsyncButton
              className="d-none d-lg-block bg-success p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3 hoverBtn"
              loading={requestLoading}
              onClick={
                requestStatus == "Requested"
                  ? cancelRequest
                  : requestStatus == "Friend"
                  ? unFriend
                  : handleFriendRequest
              }
              hoverText={
                requestStatus == "Requested"
                  ? "Cancel"
                  : requestStatus == "Friend"
                  ? "Unfriend"
                  : "Add Friend"
              }
            >
              <span>{requestStatus}</span>
            </AsyncButton>
            <a
              href="/defaultemailbox"
              className="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"
            >
              <i className="feather-mail font-md"></i>
            </a>
            <a
              href="/"
              id="dropdownMenu4"
              className="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="ti-more font-md tetx-dark"></i>
            </a>
            <div
              className="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg"
              aria-labelledby="dropdownMenu4"
            >
              <div className="card-body p-0 d-flex">
                <i className="feather-bookmark text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  Save Link{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Add this to your saved items
                  </span>
                </h4>
              </div>
              <div className="card-body p-0 d-flex mt-2">
                <i className="feather-alert-circle text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  Hide Post{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Save to your saved items
                  </span>
                </h4>
              </div>
              <div className="card-body p-0 d-flex mt-2">
                <i className="feather-alert-octagon text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  Hide all from Group{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Save to your saved items
                  </span>
                </h4>
              </div>
              <div className="card-body p-0 d-flex mt-2">
                <i className="feather-lock text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 mb-0 text-grey-900 font-xssss mt-0 me-0">
                  Unfollow Group{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Save to your saved items
                  </span>
                </h4>
              </div>
            </div>
          </div>
        )}
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
          <li className="list-inline-item me-5">
            <a
              className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href="#navtabs2"
              data-toggle="tab"
            >
              Friends
            </a>
          </li>
          <li className="list-inline-item me-5">
            <a
              className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href="#navtabs3"
              data-toggle="tab"
            >
              Posts
            </a>
          </li>
          <li className="list-inline-item me-5">
            <a
              className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href="#navtabs4"
              data-toggle="tab"
            >
              My Movies
            </a>
          </li>
          <li className="list-inline-item me-5">
            <a
              className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href="#navtabs3"
              data-toggle="tab"
            >
              Houses
            </a>
          </li>
          <li className="list-inline-item me-5">
            <a
              className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href="#navtabs1"
              data-toggle="tab"
            >
              Awards
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilecardThree;
