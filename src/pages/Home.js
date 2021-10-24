import moment from "moment";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import "../../new.css";
import Appfooter from "../components/Appfooter";
import Createpost from "../components/Createpost";
import Friends from "../components/Friends";
import Load from "../components/Load";
import Popupchat from "../components/Popupchat";
import Postview from "../components/Postview";
import { db } from "./../firebase";

const friendList = [
  {
    imageUrl: "user.png",
    name: "Anthony Daugloi",
    friend: "12",
  },
  {
    imageUrl: "user.png",
    name: "Mohannad Zitoun",
    friend: "18",
  },
  {
    imageUrl: "user.png",
    name: "Hurin Seary",
    friend: "28",
  },
];

const Home = () => {
  const [postsList, setPostsList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [pageState, setPageState] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(null);
  const history = useHistory();

  // useEffect(() => {
  //   if (history.location.state?.name) {
  //     history.push(
  //       `${history.location.state.name}/${history.location.state.id}`,
  //       { noRefresh: true }
  //     );
  //   }
  // }, [history.location.state]);

  useEffect(() => {
    setFetching(true);
    if (!pageNumber) {
      setFetching(true);
      db.child("posts")
        .orderByChild("postInfo/creationDt")
        .limitToLast(3)
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            console.log("post data", snapshot.val());
            let valuesList = Object.values(snapshot.val());
            setPageState(valuesList[0].postInfo.creationDt);
            setPostsList(valuesList.reverse());
            setHasMore(true);
          } else {
            console.log("No data available");
            setHasMore(false);
          }
          setFetching(false);
        });
    } else
      db.child("posts")
        .orderByChild("postInfo/creationDt")
        .endBefore(pageState)
        .limitToLast(3)
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            console.log("post data", snapshot.val());
            let valuesList = Object.values(snapshot.val());
            setPageState(valuesList[0].postInfo.creationDt);
            setPostsList([...postsList, ...valuesList.reverse()]);
            setHasMore(true);
          } else {
            console.log("No data available");
            setHasMore(false);
          }
          setFetching(false);
        });
  }, [pageNumber]);

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
      <div className="middle-sidebar-bottom">
        <div className="middle-sidebar-left">
          <div className="row feed-body">
            <div className="col-xl-9 col-xxl-9 col-lg-9 NewsFeed">
              <Createpost />
              {postsList.map(({ postInfo }, index) => {
                if (postsList.length === index + 1) {
                  return (
                    <Postview
                      ref={lastBookElementRef}
                      key={postInfo.id}
                      id={postInfo.id}
                      postvideo=""
                      postimage={postInfo.thumbnail}
                      user={postInfo.user}
                      time={moment.unix(postInfo.creationDt).fromNow()}
                      des={postInfo.description}
                      likes={postInfo.likes}
                      comments={postInfo.comments}
                      shares={postInfo.share}
                      stubs={postInfo.stubs}
                    />
                  );
                } else {
                  return (
                    <Postview
                      key={postInfo.id}
                      id={postInfo.id}
                      postvideo=""
                      postimage={postInfo.thumbnail}
                      user={postInfo.user}
                      time={moment.unix(postInfo.creationDt).fromNow()}
                      des={postInfo.description}
                      likes={postInfo.likes}
                      comments={postInfo.comments}
                      shares={postInfo.share}
                      stubs={postInfo.stubs}
                    />
                  );
                }
              })}

              {fetching && <Load />}
            </div>
            <div className="col-xl-3 col-xxl-3 col-lg-3 ps-lg-0 NewsFeed">
              <Friends />
              <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                <div className="card-body d-flex align-items-center p-4">
                  <h4 className="fw-700 mb-0 font-xssss text-grey-900">
                    Houses
                  </h4>
                  <a
                    href="/defaultmember"
                    className="fw-600 ms-auto font-xssss text-primary"
                  >
                    See all
                  </a>
                </div>
                {friendList.map((value, index) => (
                  <div className="wrap" key={index}>
                    <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
                      <figure className="avatar me-3">
                        <img
                          src={`assets/images/${value.imageUrl}`}
                          alt="avater"
                          className="shadow-sm rounded-circle w45"
                        />
                      </figure>
                      <h4 className="fw-700 text-grey-900 font-xsss mt-3">
                        House name
                      </h4>
                    </div>
                    <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                      <a
                        href="/defaultmember"
                        className="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl"
                      >
                        Join
                      </a>
                      <a
                        href="/defaultmember"
                        className="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl"
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default Home;
