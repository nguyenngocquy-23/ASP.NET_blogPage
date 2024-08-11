import React from 'react';
import {CommentType} from "./commentType";
import './CommentStyle.css'
import {formatRelativeTime} from "../../utils/dateUtils";
import {MdModeEdit} from "react-icons/md";
import {IoMdRemoveCircle} from "react-icons/io";
import CommentForm from "./CommentForm";
import {ActiveComment} from "./CommentList";
import { GrUserAdmin } from "react-icons/gr";
import { MdAdminPanelSettings } from "react-icons/md";




interface CommentProps {
    comment: CommentType;
    replies: CommentType[];
    currentUser: number;
    deleteComment: (commentId: number) => void;
    activeComment: ActiveComment;
    setActiveComment: React.Dispatch<React.SetStateAction<ActiveComment>>;
    addComment: (text: string, parentId: number| null) => void;
    updateComment: (text: string, commentId: number) =>Promise<void>;
    parentId: number| null;
}

const Comment: React.FC<CommentProps> = ({
                                             comment,
                                             replies,
                                             currentUser,
                                             deleteComment,
                                            updateComment,
                                             activeComment,
                                             setActiveComment,
                                             addComment,
                                             parentId=null,

                                         }) => {

    const fiveMinutes = 300000;
    const currentDay = new Date();
    const commentDay = new Date(comment.createdAt);

    const timePassed = currentDay.getTime() - commentDay.getTime() > fiveMinutes;
    const canReply = Boolean(currentUser);

    // Chỉnh sửa : chỉ có ngưười viết mới có quyền chỉnh sửa, thời gian để chỉnh sửa chỉ là 5'
    const canEdit = currentUser === comment.userId && !timePassed;

    // Xóa: người viết có quyền xóa comment, admin cũng vậy !!
    const canDelete = (currentUser === comment.userId && !timePassed || currentUser === 1) || currentUser === 1;
    console.log("Co quyen xoa khong?" + canDelete);

    const isReplying = activeComment
        && activeComment.type === 'replying'
        && activeComment.id === comment.id;
    //
    const isEditing = activeComment
        && activeComment.type === 'editing'
        && activeComment.id === comment.id;
    const replyId = parentId ?parentId : comment.id;


    return (
        <div className="comment">
            <div className="comment-avatar">
                <img src="https://i.pinimg.com/564x/70/e4/ea/70e4ea4af5c79a543e3e79b1d67e1205.jpg" alt=""/>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.userName}

                    </div>

                    {comment.userId===1 && (
                        <div className="comment-admin"><MdAdminPanelSettings /></div>
                    )}

                    <span className="comment-date">{formatRelativeTime(comment.createdAt)}</span>


                </div>

                {/*Xử lý chỉnh sửa bình luận.*/}


                {!isEditing && <div className="comment-text">{comment.content}</div> }
                {isEditing && (
                    <CommentForm
                        handleSubmit={(text) => updateComment(text, comment.id)} // sử dụng axios put text & comment BE
                        submitLabel="Cập nhật"
                        hasCancelButton // nút hủy chỉnh sửa.
                        initialText={comment.content} // mặc định nó hiển thị comment trước đó.
                        handleCancel={() => setActiveComment(null)}
                    />


                )}





                <div className="comment-actions">
                    {canReply && <div className="comment-action"
                                      onClick={() => setActiveComment({
                                          id: comment.id,
                                          type: "replying"

                                      })}

                    >Trả lời</div>}
                    {canEdit && <div className="comment-action edit-action"
                                     onClick={() => setActiveComment({
                                         id: comment.id,
                                         type: "editing"

                                     })}


                    ><MdModeEdit/></div>}
                    {canDelete && <div className="comment-action remove-action"
                                       onClick={() => deleteComment(comment.id)}
                    >
                        <IoMdRemoveCircle/>
                    </div>}

                    {comment.status === 0 && (
                        <span className="comment-note">[Người dùng đã xóa]</span>
                    )}

                </div>

                {isReplying && (
                    <CommentForm
                        handleSubmit={(text) => addComment(text,replyId)}
                        submitLabel="Trả lời"
                    />

                )}


                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment comment={reply}
                                     replies={[]}
                                     key={reply.id}
                                     currentUser={currentUser}
                                     deleteComment={deleteComment}
                                     updateComment={updateComment}
                                     activeComment={activeComment}
                                     setActiveComment={setActiveComment}
                                     addComment={addComment}
                                     parentId = {comment.id}
                            />

                        ))}
                    </div>
                )}


            </div>
        </div>
    )


}


export default Comment;