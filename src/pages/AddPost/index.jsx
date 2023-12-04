import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, Navigate, useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  // Проверка, аутентифицирован ли пользователь с использованием состояния Redux
  const isAuth = useSelector(selectIsAuth);

  const [isLoading, setLoading] = React.useState(false);

  // Настройка состояния для значения ввода
  const [text, setText] = React.useState('');

  const [tags, setTags] = React.useState('');

  const [title, setTitle] = React.useState('');

  const [imageUrl, setImageUrl] = React.useState('');

  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage =  () => {
    if (window.confirm('Вы действительно хотите удалить эту картинку?')) {
      setImageUrl('');
    };
  };

  // Функция обратного вызова для обновления состояния значением ввода
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const {data} = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);

    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи!');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(', '));
      }).catch(err => {
        console.warn(err);
        alert('Ошибка при получении статьи!');
      });
    };
  }, []);
  
  // Мемоизированные опции для текстового редактора
  const options = React.useMemo(
    () => ({
      spellChecker: false, // Отключение проверки орфографии
      maxHeight: '400px', // Максимальная высота текстового редактора
      autofocus: true, // Автоматически устанавливать фокус на текстовый редактор
      placeholder: 'Введите текст...', // Текст заполнителя для текстового редактора
      status: false, // Отключение статуса текстового редактора
      autosave: {
        enabled: true, // Включение автосохранения
        delay: 1000, // Задержка перед автосохранением (в миллисекундах)
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to= "/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={ title }
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Тэги" 
        value={ tags }
        onChange={e => setTags(e.target.value)}
        fullWidth 
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          { isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
