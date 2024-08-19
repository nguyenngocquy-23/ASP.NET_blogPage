import React, {useEffect, useState} from 'react';
import Comment from "./Comment";
import axios from "axios";
import {CommentType} from "./commentType";
import './CommentStyle.css';
import CommentForm from "./CommentForm";
import moment from "moment";
import comment from "./Comment";
import { User} from "../../utils/UserUtils";
import Swal from 'sweetalert2'
export type ActiveComment = {
    id: number;
    type : 'editing' | 'replying';
} | null;


interface CommentListProps {
    blogId : number;
    currentUser: User;
}


const CommentList : React.FC<CommentListProps> = ({currentUser, blogId}) => {
    const [backendComments, setBackendComments] = useState<CommentType[]>([]);

    // Hỗ trợ phân trang.
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;


    // sử dụng để edit or reply.
   const [activeComment, setActiveComment] = useState<ActiveComment>(null);

    //comment
    const rootComments =    backendComments.filter((backendComment) => backendComment.parentId === null);


    const getReplies = (commentId : number) : CommentType[] => {
        return backendComments.filter((backendComment) => backendComment.parentId === commentId)
            .sort(
                (a,b) => new Date(a.createdAt).getTime()
                - new Date(b.createdAt).getTime()
            );

    };

    /**
     * Thêm bình luận.
     * 1. Role = 0 (Admin) -> Status sẽ là 1 luôn.
     * 2. Role = 1 (User) -> Status sẽ là 2.d
     * @param text
     * @param parentId
     */
    const addComment = async (text: string, parentId: number | null = null) => {
        console.log('addComment', text, parentId);
// Role = 0 (admin) thì status sẽ là 1 [Đã kiểm duyệt], còn role = 1 thì status = 2 [Chưa kiểm duyệt].
        const status = currentUser.role ===0 ? 1: 2;
        const newComment = {
            userId: currentUser.id,
            blogId: blogId,
            content: text,
            status: status,
            createAt: moment().toISOString(),
            parentId: parentId
        };
        try {
             const response = await axios.post('https://localhost:7125/api/Comment', newComment);

            // Lấy comment mới thêm từ phản hồi
            const addedComment = response.data;

            // Cập nhật danh sách bình luận dựa trên parentId
            setBackendComments(prevComments => {
                // Nếu parentId là null, thêm bình luận mới ở đầu danh sách
                if (parentId === null) {
                    return [addedComment, ...prevComments];
                }
                // Nếu parentId khác null, thêm bình luận mới vào danh sách bình luận con
                return [...prevComments, addedComment];
            });

            // Lọc danh sách bình luận dựa trên vai trò của người dùng
            // const addedComment = {
            //     id: 23,
            //     userId: newComment.userId,
            //     role: currentUser.role,
            //     userName: currentUser.fullName,
            //     status: newComment.status,
            //     content : newComment.content,
            //     createdAt: newComment.createAt,
            //     parentId: newComment.parentId
            // }
            //
            //
            //
            //
            // setBackendComments(prevComment =>
            //     {
            //         if(addedComment.parentId === null) {
            //             return [
            //                 addedComment,
            //                 ...prevComment
            //             ];
            //         }
            //         else {
            //             return [
            //                 ...prevComment,
            //                 addedComment
            //             ];
            //
            //         }
            //
            //     }
            // );
            // setBackendComments(prevComments => [
            //     ...prevComments,
            //     response.data,
            // ]);

            setActiveComment(null);

        } catch (error) {
            console.error('Error posting comment: ', error);
        }
    };


    // Xóa bình luận.
    // Thực chất việc xóa bình luận là chuyển status sang = 0.
    const deleteComment =  async (commentId: number) => {
        const result = await Swal.fire({
            title: 'Bạn sẽ thủ tiêu bình luận này thật sao?',
            text: 'Hành động này sẽ một đi không trở lại!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đúng, xóa nó đi!',
            cancelButtonText: 'Hủy'
        })

        if(result.isConfirmed) {
            try {

                Swal.fire({
                    title: 'Đang xử lý...',
                    text: 'Vui lòng chờ trong giây lát.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const updateReq = {
                    status : 0
                };

                const response = await axios.put(`https://localhost:7125/api/Comment/${commentId}`, updateReq);

                await  Swal.fire({
                    title: 'Xóa thành công',
                    text: response.data,
                    icon: 'success',
                    confirmButtonText: 'Đóng'
                });

                // Cập nhật giao diện dựa trên role người dùng.
                if(currentUser.role ===0 ) {
                    const updatedBackendComments = backendComments.map((backendComment) => {
                        if (backendComment.id === commentId) {
                            return {...backendComment, status: 0}; // Cập nhật trạng thái trong giao diện
                        }
                        return backendComment;
                    });
                setBackendComments(updatedBackendComments);
                }
                else if(currentUser.role ===1) {
                    const  filterBackEndComments = backendComments.filter((backendComment) => backendComment.id != commentId);
                    setBackendComments(filterBackEndComments);
                }



            } catch (error) {
                console.error("Lỗi khi xóa bình luận", error);
                await Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi xóa bình luận, Vui lòng thử lại',
                    icon: 'error',
                    confirmButtonText: 'Đóng'
                });
            }


        }



    }

    /**
     * Chỉnh sửa bình luận.
     * Admin : Sửa bình luận sẽ vào trạng thái đã kiểm duyệt luôn (status = 1).
     * User: Sửa bình luận sẽ trả lại trạng thái chưa kiểm duyệt (status = 2).
     * @param text
     * @param commentId
     */
    const updateComment = async (text: string, commentId: number) => {

        try {
            const status = currentUser.role=== 0 ? 1: 2;
            const updateReq = {
                content: text,
                status : status
            };
            await axios.put(`https://localhost:7125/api/Comment/${commentId}`, updateReq);



            const updatedBackendComments = backendComments.map((backendComment) => {
                if(backendComment.id === commentId) {
                    return { ...backendComment, content: text, status: status};
                }
                return backendComment;
            });

            setBackendComments(updatedBackendComments);
            setActiveComment(null);

        }
        catch(error) {
            console.error(`Lỗi khi cập nhật bình luận: ${error}`);
        }

    };

    /// Logic lấy dữ liệu hiển thị giao diện :
    /// + Đối với user(role = 1) thường : các status 1 - [Đã kiểm duyệt/hiển thị], 2 - [Chưa kiểm duyệt/hiển thị]
    ///+ đối với admin (role =0): status 0 [Đã ẩn - xem được], status 1 [Đã kiểm duyệt/ hiển thị], 2 - [Chưa kiểm duyệt/hiển thị]

        useEffect(() => {
            const fetchComments = async () => {
                try {
                    const response =
                        await axios.get(`https://localhost:7125/api/Comment/${blogId}?page=${page}&pageSize=${pageSize}`);
                    let comments = response.data;

                    // Lọc bình luận dựa trên vai trò của người dùng
                    // status - 0 : comment đã bị xóa => chỉ có admin (role - 0) mới có thể xem được.
                    // role =1 : người dùng bình thường.
                    if (currentUser.role !== 0) {
                        comments = comments.filter((comment: { status: number; }) => comment.status !== 0);
                    }

                    // Nếu số lượng bl < pageSize, ko còn bl nữa.
                    if(comments.length < pageSize) {
                        setHasMore(false);
                    }

                    // Kiểm tra và ngăn chặn việc lặp lại bình luận
                    setBackendComments((prevComments) => {
                        const uniqueComments = comments.filter(
                            (comment: { id: number; }) => !prevComments.some(prevComment => prevComment.id === comment.id)
                        );
                        return [...prevComments, ...uniqueComments];
                    });
                } catch (error) {
                    console.error("Lỗi không thể lấy bình luận:", error);
                }
            };

            fetchComments();
        }, [blogId,page]);

        const handleShowMore = () => {
            setPage(prevPage => prevPage+1);
        };


    return (
        <div className="commentList">
            <CommentForm submitLabel="Đăng" handleSubmit={addComment}/>
            <div className="comments-container">
                {rootComments.map((rootComment) => (
                        <Comment key={rootComment.id}
                                 comment={rootComment}
                                 replies={getReplies(rootComment.id)}
                                 currentUser={currentUser}
                                 deleteComment={deleteComment}
                                 updateComment={updateComment}
                                 activeComment={activeComment}
                                 setActiveComment={setActiveComment}
                                 addComment={addComment}
                                 parentId={null} //root comment is null
                        />
                    )
                )}

                {hasMore && (
                    <button className="comment-form-button" onClick={handleShowMore}>
                        Xem thêm...
                    </button>
                )}
            </div>
        </div>
    );

};

export default CommentList;