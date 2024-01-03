import { getReviewComments } from '@api/review';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import CommentItem from './CommentItem';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { isModalOpenState, titleState } from '@recoil/modal';
import { Modal } from '@components/common/modal';
import { useEffect } from 'react';

export default function ReviewComments() {
  const params = useParams();
  const reviewId = Number(params.id);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
  const setTitle = useSetRecoilState(titleState);

  const { data: reviewComments } = useQuery({
    queryKey: ['reviewComments'],
    queryFn: () => getReviewComments(reviewId),
  });

  const openModal = (title: string) => {
    setTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log('reviewComments', reviewComments);
  }, [reviewComments]);
  return (
    <>
      <div className="mb-4 text-xs">
        댓글
        <span className="pl-0.5 font-bold">
          {reviewComments?.data?.data?.comments?.totalElements}
        </span>
      </div>
      {reviewComments?.data?.data?.comments?.content?.map((item: any) => {
        return (
          <CommentItem
            key={item.commentId}
            authorNickname={item.authorNickname}
            authorProfileImageUrl={item.authorProfileImageUrl}
            createdTime={item.createdTime}
            content={item.content}
            onClick={() => openModal('내 댓글')}
          />
        );
      })}
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}
