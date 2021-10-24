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
import { db } from "./../firebase";
import { useHistory, useRouteMatch } from "react-router-dom";

const House = () => {
  const [postsList, setPostsList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [pageState, setPageState] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(null);
  const { currentUser } = useAuth();
  const history = useHistory();
  const match = useRouteMatch();
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    console.log("askldnaskdsfajdnsad", match.params.id);
    let userId = match.params.id;
    setFetching(true);
    //if (userId !== currentUser?.id)
    db.child("houses")
      .child(userId)
      .child("houseInfo")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("house info", snapshot.val());
          setOtherUser(snapshot.val());
        } else {
          console.log("No data available");
        }
        setFetching(false);
      })
      .catch((error) => {
        console.error("fetching user error", error);
        setFetching(false);
      });
    //  else setOtherUser(null);

    if (!pageNumber) {
      setFetching(true);
      db.child("houses")
        .child(userId)
        .child("posts")
        .orderByKey()
        .limitToLast(3)
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            console.log("houses post data", snapshot.val());
            let valuesList = Object.values(snapshot.val());
            setPageState(valuesList[0]);
            setPostsList(valuesList.reverse());
            setHasMore(true);
          } else {
            console.log("No data available");
            setHasMore(false);
          }
          setFetching(false);
        });
    } else
      db.child("houses")
        .child(userId)
        .child("posts")
        .orderByKey()
        .endBefore(pageState)
        .limitToLast(3)
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            console.log("post data", snapshot.val());
            let valuesList = Object.values(snapshot.val());
            setPageState(valuesList[0]);
            setPostsList([...postsList, ...valuesList.reverse()]);
            setHasMore(true);
          } else {
            console.log("No data available");
            setHasMore(false);
          }
          setFetching(false);
        });
  }, [pageNumber, match.params]);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (fetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(pageState);
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetching, hasMore]
  );

  return (
    <Fragment>
      <Rightchat />
      <div className="middle-sidebar-bottom">
        <div className="middle-sidebar-left pe-0">
          <div className="row">
            <div className="col-xl-12 mb-3">
              <ProfilecardThree otherUser={otherUser} />
            </div>
            <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
              <Profiledetail otherUser={otherUser} />
            </div>
            <div className="col-xl-8 col-xxl-9 col-lg-8">
              {!otherUser && <Createpost />}
              {postsList.map((postId, index) => {
                if (postsList.length === index + 1) {
                  return (
                    <Post
                      ref={lastBookElementRef}
                      key={index}
                      postId={postId}
                    />
                  );
                } else {
                  return <Post key={index} postId={postId} />;
                }
              })}
              {fetching && <Load />}
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default House;
