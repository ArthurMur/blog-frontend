import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

// Основной компонент для отображения домашней страницы
export const Home = () => {
  const dispatch = useDispatch();  // Получение доступа к диспетчеру Redux
  const userData = useSelector(state => state.auth.data);  // Использование хука useSelector для извлечения данных из хранилища Redux
  const { posts, tags } = useSelector(state => state.posts);  // Использование хука useSelector для извлечения данных из хранилища Redux
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'Новые'); // Состояние для отслеживания текущей вкладки ('новые' или 'популярные')
  const isPostLoading = posts.satus === 'loading'; // Проверка состояния загрузки постов
  const isTagsLoading = tags.satus === 'loading'; // Проверка состояния загрузки тегов
  const uniqueTags = useMemo(() => Array.from(new Set(tags.items.map(tag => tag))), [tags.items]); // Уникальные теги
  const [selectedTag, setSelectedTag] = useState(null); // Состояние для отслеживания выбранного тега
  const displayedPosts = useMemo(() => {
    // Логика сортировки и фильтрации постов
    let sortedAndFilteredPosts = [];

    if (activeTab === 'Новые') {
      sortedAndFilteredPosts = selectedTag
        ? posts.items.filter(post => post.tags.includes(selectedTag)).slice().reverse()
        : posts.items.slice().reverse();
    } else if (activeTab === 'Популярные') {
      sortedAndFilteredPosts = selectedTag
        ? posts.items.filter(post => post.tags.includes(selectedTag)).slice().sort((a, b) => b.viewsCount - a.viewsCount)
        : posts.items.slice().sort((a, b) => b.viewsCount - a.viewsCount);
    }

    return sortedAndFilteredPosts;
  }, [activeTab, posts.items, selectedTag]); // Состояние для отслеживания текущего списка отображаемых постов

  // Загрузка постов при монтировании компонента
  useEffect(() => {
    dispatch(fetchPosts()); // Диспетчеризация асинхронного действия fetchPosts() для получения постов и тегов из API
    dispatch(fetchTags());
  }, [dispatch]);

  // Обработчик изменения вкладок
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedTag(null); // Сбрасываем выбранный тег при изменении вкладки
  };

  // Обработчик клика по тегу
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  // Эффект для сохранения состояний в localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
    localStorage.setItem('selectedTag', selectedTag);
  }, [activeTab, selectedTag]);

  return (
    <>
    {/* Вкладки для выбора "Новые" или "Популярные" посты */}
      <Tabs style={{ marginBottom: 15 }} value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab value="Новые" label="Новые" />
        <Tab value="Популярные" label="Популярные" />
      </Tabs>
      {/* Сетка для отображения постов, тегов и комментариев */}
      <Grid container spacing={4}>
        <Grid xs={8} item>
        {/* Маппинг по массиву постов, отображение заглушек при загрузке */}
          {displayedPosts.map((obj, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              // Отображение компонента поста с данными из массива
              <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={2}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
              onTagClick={handleTagClick}
              /> 
            )
          )}
        </Grid>
         {/* Область для отображения блока тегов и комментариев */}
        <Grid xs={4} item>
          <TagsBlock items={uniqueTags} isLoading={isTagsLoading} onTagClick={handleTagClick}/>
          {/* Блок для отображения комментариев */}
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Максим Максимов',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Вечная память Кентаре Миуре!',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'Берсерк - легендарное и культовое аниме всех времен!',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
