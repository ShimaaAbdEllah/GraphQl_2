import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation createNewComment($input: CommentInput!) {
    createComment(input: $input) {
      name
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($postId: Int!) {
    deletePost(input: { postId: $postId })
  }
`;

export default function PostCard(props) {
  const [imageUrl, setImageUrl] = useState("");
  const [comment, setComment] = useState(null);

  const generateNewImage = async () => {
    const res = await fetch("https://picsum.photos/800/400");
    setImageUrl(res.url);
  };

  useEffect(() => {
    generateNewImage();
  }, []);

  const [mutate, { data, loading, error }] = useMutation(CREATE_COMMENT);
  const [mutateDel] = useMutation(DELETE_POST);
  if (loading) return <p>Creating comment ...</p>;
  if (error) return <p>Error occurred: {error.message}</p>;

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  async function handleDelete() {
    await mutateDel({
      variables: {
        postId: props.postId,
      },
    });
    await props.refetch();
  }

  async function submitComment() {
    if (!comment) return;

    await mutate({
      variables: {
        input: {
          postId: props.postId,
          name: comment,
        },
      },
    });

    await props.refetch();

    setComment(null);
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={imageUrl} alt="{props.title}" />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{props.title}</h2>
        <p className="text-gray-700 mb-4">{props.body}</p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-full"
        >
          Delete Post
        </button>
      </div>
      <div className="p-4 bg-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>
        <ul>
          {props.comments.map((comment) => (
            <li key={comment.id} className="text-gray-800 mb-1">
              {comment.name}
            </li>
          ))}
        </ul>
        <input
          placeholder="Write your comment ..."
          onChange={handleCommentChange}
          className="border border-gray-300 rounded px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={submitComment}
          className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4"
        >
          Add
        </button>
      </div>
    </div>
  );
}
