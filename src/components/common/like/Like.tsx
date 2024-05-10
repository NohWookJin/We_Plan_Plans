import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '../icons/Icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLikedTours, postLikedTours } from '@api/tours';

import Alert from '../alert/Alert';
import { useState } from 'react';

const Like = ({ liked, id }: LikeProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [optimisticLiked, setOptimisticLiked] = useState<boolean>(liked);

  const { mutate: likeMutate } = useMutation({
    mutationFn: (id: number) => postLikedTours({ id }),
    onMutate: () => {
      setOptimisticLiked(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['details'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['wishList'] });
    },
    onError: () => {
      console.log('error');
      setOptimisticLiked(false); // Revert on error
    },
  });

  const { mutate: unlikeMutate } = useMutation({
    mutationFn: (id: number) => deleteLikedTours({ id }),
    onMutate: () => {
      setOptimisticLiked(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['details'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['wishList'] });
    },
    onError: () => {
      console.log('error');
      setOptimisticLiked(true); 
    },
  });

  const onClickLikeButton = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      if (optimisticLiked === false) {
        likeMutate(id);
      } else {
        unlikeMutate(id);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleConfirm = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate('/login');
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <div
            onClick={onClickLikeButton}
            className="top-75 h-[24px] w-[24px] cursor-pointer">
            <HeartIcon
              fill={optimisticLiked ? '#FF2167' : '#D7D7D7'}
              color={optimisticLiked ? '#ff2167' : '#ffffff'}
            />
          </div>
        </>
      ) : (
        <>
          <Alert
            title={'로그인'}
            message={
              <>
                관심 여행지를 추가하려면 로그인이 필요해요.
                <br />
                로그인하러 가볼까요?
              </>
            }
            onConfirm={handleConfirm}
            onCancel={handleCancel}>
            <div
              onClick={onClickLikeButton}
              className="top-75 h-[24px] w-[24px] cursor-pointer">
              <HeartIcon
                fill={optimisticLiked ? '#FF2167' : '#D7D7D7'}
                color={optimisticLiked ? '#ff2167' : '#ffffff'}
              />
            </div>
          </Alert>
        </>
      )}
    </>
  );
};

export default Like;

