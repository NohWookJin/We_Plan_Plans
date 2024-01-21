import SearchInput from '@components/search/SearchInput';
import { MyLiked } from '@pages/plan/addToOurPlace/MyLiked';
import { SearchResultForPlan } from '@pages/plan/addToOurPlace/SearchResult';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AddOurList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchWordFromQuery = queryParams.get('searchWord');

  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    if (searchWordFromQuery) {
      setSearchWord(searchWordFromQuery);
    } else {
      setSearchWord('');
    }
  }, [location, searchWordFromQuery]);
  return (
    <div>
      <SearchInput />
      {searchWord ? (
        <SearchResultForPlan searchWord={searchWord} apiType="postTripsLike" />
      ) : (
        <MyLiked />
      )}
    </div>
  );
};
