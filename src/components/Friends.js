import React, { useEffect, useState } from "react";
import { useAuth } from "./../context/AuthContext";
import { db } from "./../firebase";
import AsyncButton from "./AsyncButton";

const Friends = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [requestLoading, setRequestLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [friendReqsList, setFriendReqsList] = useState([]);

  useEffect(() => {
    // setRequestLoading(true);
    db.child("user")
      .child(currentUser?.id)
      .child("friendRequests")
      .child("recived")
      .orderByChild("userId")
      .limitToFirst(3)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          let valuesList = Object.keys(snapshot.val());
          valuesList.forEach((value) => {
            db.child("user")
              .child(value)
              .child("UserInfo")
              .get()
              .then((user) => {
                if (user.exists())
                  setFriendReqsList((req) => [...req, user.val()]);
              });
          });
        }
        //  setRequestLoading(false);
      });
  }, [currentUser]);

  const handleRequest = ({ id, name }, action) => {
    action == "confirm" ? setRequestLoading(true) : setCancelLoading(true);
    return new Promise((resolve, reject) => {
      db.child("user")
        .child(currentUser?.id)
        .child("friendRequests")
        .child("recived")
        .child(id)
        .remove()
        .then(() => {
          db.child("user")
            .child(id)
            .child("friendRequests")
            .child("sent")
            .child(currentUser?.id)
            .remove()
            .then(() => {
              if (action == "confirm")
                db.child("user")
                  .child(currentUser?.id)
                  .child("friends")
                  .child(id)
                  .set({ id, name })
                  .then(() => {
                    db.child("user")
                      .child(id)
                      .child("friends")
                      .child(currentUser?.id)
                      .set({ id: currentUser?.id, name: currentUser?.name })
                      .then(() => {
                        setFriendReqsList(
                          friendReqsList.filter((value) => value.id !== id)
                        );
                        resolve();
                      })
                      .catch(() => reject())
                      .finally(() =>
                        action == "confirm"
                          ? setRequestLoading(false)
                          : setCancelLoading(false)
                      );
                  })
                  .catch(() => {
                    action == "confirm"
                      ? setRequestLoading(false)
                      : setCancelLoading(false);
                    reject();
                  });
              else
                action == "confirm"
                  ? setRequestLoading(false)
                  : setCancelLoading(false);
            })
            .catch(() => {
              reject();
              action == "confirm"
                ? setRequestLoading(false)
                : setCancelLoading(false);
            });
        })
        .catch(() => {
          reject();
          action == "confirm"
            ? setRequestLoading(false)
            : setCancelLoading(false);
        });
    });
  };

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-flex align-items-center p-4">
        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Friend Request</h4>
        <a
          href="/defaultmember"
          className="fw-600 ms-auto font-xssss text-primary"
        >
          See all
        </a>
      </div>
      {friendReqsList.map((value, index) => (
        <div className="wrap" key={index}>
          <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
            <figure className="avatar me-3">
              <img
                src={value.thumbnail}
                alt="avater"
                className="shadow-sm rounded-circle w45"
              />
            </figure>
            <h4 className="fw-700 text-grey-900 font-xssss mt-1">
              {value.name}{" "}
              {/* <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                {value.friend} mutual friends
              </span> */}
            </h4>
          </div>
          <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
            <AsyncButton
              className="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl"
              onClick={() => handleRequest(value, "confirm")}
              loading={requestLoading}
            >
              Confirm
            </AsyncButton>
            <AsyncButton
              className="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl"
              onClick={() => handleRequest(value, "cancel")}
              loading={cancelLoading}
            >
              Delete
            </AsyncButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friends;
