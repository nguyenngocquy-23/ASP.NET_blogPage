import React, {useEffect, useState} from 'react';
import Comment from "./Comment";
import axios from "axios";
import {CommentType} from "./commentType";
import './CommentStyle.css';
import CommentForm from "./CommentForm";
import moment from "moment";
import comment from "./Comment";

export type ActiveComment = {
    id: number;
    type : 'editing' | 'replying';
} | null;


interface CommentListProps {
    blogId : number;
    currentUser: number;
}
const  blogId = 2;

const CommentList : React.FC<CommentListProps> = ({currentUser}) => {
    const [backendComments, setBackendComments] = useState<CommentType[]>([]);

    // sử dụng để edit or reply.
   const [activeComment, setActiveComment] = useState<ActiveComment>(null);

    //comment
    const rootComments = backendComments.filter((backendComment) => backendComment.parentId === null);


    console.log('backendComments', backendComments);

    const getReplies = (commentId : number) : CommentType[] => {
        return backendComments.filter((backendComment) => backendComment.parentId === commentId)
            .sort(
                (a,b) => new Date(a.createdAt).getTime()
                - new Date(b.createdAt).getTime()
            );

    };

    //Thêm bình luuận
    const addComment = async (text: string, parentId: number | null = null) => {
        console.log('addComment', text, parentId);
        const newComment = {
            userId: currentUser,
            blogId: 2,
            content: text,
            status: 1,
            createAt: moment().toISOString(),
            parentId: parentId
        };
        try {
            await axios.post('https://localhost:7125/api/Comment', newComment);
            const response = await axios.get('https://localhost:7125/api/Comment/2');
            setBackendComments(response.data);
            setActiveComment(null);

        } catch (error) {
            console.error('Error posting comment: ', error);
        }
    };


    // Xóa bình luận.
    const deleteComment =  async (commentId: number) => {
        if(window.confirm("Bạn sẽ xóa mình thật à @.@")) {
            try {

                const response = await axios.delete(`https://localhost:7125/api/Comment/${commentId}`);
                alert(response.data);

                // cập nhật giao diện.
                 const updateBackendComments = backendComments
                    .filter(backendComment => backendComment.id !== commentId);
                setBackendComments(updateBackendComments);

            } catch (error) {
                    console.error("Lỗi khi xóa biình luận", error);
                    alert("Có lỗi xảy ra khi xóa bình luận, Vui lòng thử lại");
            }


        }



    }

    // chiỉnh sửa bình luận
    const updateComment = async (text: string, commentId: number) => {
        try {
            const updateReq = {
                content: text
            };
            await axios.put(`https://localhost:7125/api/Comment/${commentId}`, updateReq);



            const updatedBackendComments = backendComments.map((backendComment) => {
                if(backendComment.id === commentId) {
                    return { ...backendComment, content: text, status: 2};
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
    /// + Đối với user thường : các status 1 - bình thường, 2 - đã chỉnh sửa đều xem được.
    ///+ đối với admin: Xem được cả status 0 - Ẩn. và có thể xóa các comment khác.

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://localhost:7125/api/Comment/${blogId}`);
                let comments = response.data;

                // Lọc bình luận dựa trên vai trò của người dùng
                if (currentUser !== 1) {
                    comments = comments.filter((comment: { status: number; }) => comment.status !== 0);
                }

                setBackendComments(comments);
            } catch (error) {
                console.error("Lỗi không thể lấy bình luận:", error);
            }
        };

        fetchComments();
    }, [blogId, currentUser]);


    // useEffect(() => {
    //     axios.get(`https://localhost:7125/api/Comment/${blogId}`)
    //         .then(response => {
    //             setBackendComments(response.data);
    //         }).catch(error => {
    //         console.error("Loi khong the fetching binh luan", error);
    //
    //     })
    //
    //
    // }, [blogId]);

    return (
        <div className="commentList mt-5">
            <CommentForm submitLabel="Đăng" handleSubmit={addComment} />
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
            </div>
        </div>
    );

};

export default CommentList;