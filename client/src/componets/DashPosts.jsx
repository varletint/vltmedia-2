import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState({});
  const [showMore, setShoMore] = useState(true)
  // console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length < 9) {
            setShoMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = userPosts.length

    try {
      const res = await fetch(`/api/post/getposts?userId=
        ${currentUser._id}&startIndex${startIndex}`);
      const data = await res.json();
      if(res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])
        if(data.posts.length < 9) {
          setShoMore(false)
        }
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div
      className=" table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300"
    >
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table className=" shadow-md">
            <Table.Head>
              <Table.HeadCell> Date updated</Table.HeadCell>
              <Table.HeadCell> Post Image</Table.HeadCell>
              <Table.HeadCell> Post title</Table.HeadCell>
              <Table.HeadCell> Category</Table.HeadCell>
              <Table.HeadCell> Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            {userPosts.map((post) => (
              <Table.Body className=" divide-y">
                <Table.Row>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className=" w-20 h-10 bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className=" font-medium text-gray-900"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className=" text-red-500 font-medium hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className=" text-teal-500 hover:text-gray-900"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className=" w-full text-teal-500 p-7  self-center">Show more</button>
            )
          }
        </>
      ) : (
        <p className="  text-center text-red-500 font-semibold self-center">
          You have no posts yet
        </p>
      )}
    </div>
  );
}