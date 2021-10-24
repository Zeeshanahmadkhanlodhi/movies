import Postview from "./Postview";
import { db } from "./../firebase";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Post = React.forwardRef((props, ref) => {
  const [postInfo, setPostInfo] = useState();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    db.child("posts")
      .child(props.postId)
      .child("postInfo")
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("post data", snapshot.val());
          setPostInfo(snapshot.val());
        } else {
          console.log("No data available");
        }
        setFetching(false);
      });
  }, [props.postId]);

  return postInfo ? (
    <Postview
      ref={ref}
      key={postInfo?.id}
      id={postInfo?.id}
      postvideo=""
      postimage={postInfo?.thumbnail}
      user={postInfo?.user}
      time={moment.unix(postInfo?.creationDt).fromNow()}
      des={postInfo?.description}
      likes={postInfo?.likes}
      comments={postInfo?.comments}
      shares={postInfo?.share}
      stubs={postInfo?.stubs}
    />
  ) : null;
});

export default Post;
