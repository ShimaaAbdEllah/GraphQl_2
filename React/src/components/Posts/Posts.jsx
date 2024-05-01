import { gql, useQuery } from "@apollo/client";
import PostCard from "./PostCard";

const POST_DETAILS = gql`
  fragment postDetails on Post {
    id
    title
    body
  }
`;

const GET_POSTS = gql`
  query getAllPosts(
    $input: PaginationInput!
    $commentsPagination: PaginationInput!
  ) {
    posts(input: $input) {
      ...postDetails
      comments(input: $commentsPagination) {
        name
      }
    }
  }
  ${POST_DETAILS}
`;

export default function Posts() {
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: {
      input: {
        page: 2,
        count: 6,
      },
      commentsPagination: {
        page: 1,
        count: 2,
      },
    },
  });

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>An error occured: {error.message}</p>;

  return (
    <div className="flex flex-wrap justify-between">
      {data.posts.map((post) => (
        <PostCard
          key={post.id}
          postId={post.id}
          refetch={refetch}
          title={post.title}
          comments={post.comments}
          body={post.body}
        />
      ))}
    </div>
  );
}
