import './App.css';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { GrFormAdd } from 'react-icons/gr';
import { styled } from '@mui/material/styles';
import { BiSearchAlt2 } from 'react-icons/bi';
import InputBase from '@mui/material/InputBase';
import logo from './NEWS LOGO.jpg';
import axios from 'axios';
import moment from 'moment';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: "#FFFFFF",
  borderRadius: '35px',
  border: '1px solid #E5E5E5',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 2, 2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '85vw',
    },
  },
}));
let Category = [
  {
    category_name: "TechCrunch",
    category_id: 1
  },
  {
    category_name: "Business",
    category_id: 2
  },
  {
    category_name: "Wall Street Journal",
    category_id: 3
  },
]
function App() {
  const [open, setOpen] = React.useState(false);
  const [categoryname, setcategoryname] = React.useState('TechCrunch');
  const [newcategoryname, setnewcategoryname] = React.useState('');
  const [newcategoryurl, setnewcategoryurl] = React.useState('');
  const [searchedname, setsearchedname] = React.useState('');

  const [searchedarticles, setsearchedarticles] = React.useState([]);
  const [searched, setsearched] = React.useState(false);
  const [articles_list, setarticles_list] = React.useState([]);
  let id = 3

  const API_URL = 'https://newsapi.org/v2/everything';

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    Category.push({ category_name: newcategoryname, category_id: id + 1 })
    setnewcategoryname('')
    setnewcategoryurl('')
    setOpen(false);

  };




  React.useEffect(() => {
    setarticles_list([])
    axios.get(API_URL, { params: { "q": categoryname, apiKey: "a5cf886a8dd84801a01c8b5bd0da1b0d" } })
      .then(res => {
        const news_list = res.data.articles;
        setarticles_list(res.data.articles)
      })
  }, [categoryname])

  const searchingarticles = (name) => {
    let searchData = name.toLowerCase();
    const match = articles_list.filter(post => {
      const result = post.title.toLowerCase().includes(searchData)
      return result
    })
    setsearchedarticles(match);

    if (name == "") {
      setsearched(false)
      setsearchedarticles([])
    }
  }
  return (
    <div className="newsAppMainContainer">
      <div className="headingText">
        News App
      </div>
      <div className="btnContainer">
        {Category.map(({ category_name, category_id }) => {
          return (
            <div id={category_id} onClick={() => { setcategoryname(category_name); setsearchedname('') }} style={{ backgroundColor: categoryname == category_name ? '#00F0C2' : '#EAEAEA', color: categoryname == category_name ? 'black' : '#7E7E7E' }} className="businessBtn">
              {category_name}
            </div>
          )
        })}
        {Category.length >= 5 ? <div className="addBtn" >
          <GrFormAdd size={25} />
        </div> :
          <div className="addBtn" onClick={handleClickOpen}>
            <GrFormAdd size={25} />
          </div>
        }
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{ width: "40vw", padding: "24px" }}>Add Category</DialogTitle>
          <DialogContent
            className='inputfield'>


            <TextField
              autoFocus
              margin="dense"
              id="categoryname"
              label="Category Name"
              type="Category_Name"
              variant="standard"
              className='inputfield'
              value={newcategoryname}
              onChange={(e) => { setnewcategoryname(e.target.value) }}
            />
            <div className='inputDiv'>
              <TextField
                margin="dense"
                id="apiurl"
                label="API URL"
                type="api_url"

                variant="standard"
                className='inputfield'
                value={newcategoryurl}
                onChange={(e) => { setnewcategoryurl(e.target.value) }}
              /></div>
          </DialogContent>
          <div className='dialogAddBtnDiv'>
            <div className="dialogAddBtn" onClick={handleClose}>
              Add
            </div>
          </div>
        </Dialog>
      </div>

      <div className="searchbarDiv">
        <Search>
          <SearchIconWrapper>
            <BiSearchAlt2 color='#7E7E7E' size={20} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for Keywords, title"
            inputProps={{ 'aria-label': 'search' }}
            value={searchedname}
            onChange={(e) => {
              searchingarticles(e.target.value); setsearchedname(e.target.value);
              if (e.target.value == '') {
                setsearched(false)
                setsearchedarticles([])
                setsearchedname('');
              }
              else {
                setsearched(true)
              }
            }}
          />
        </Search>
      </div>
      {
        searched == true ?
          <div className='mainContainer'>
            {searchedarticles.length > 0 ? searchedarticles.map(({ author, content, description, publishedAt, source, title, url, urlToImage }) => {
              return (
                <div className='subContainer'>
                  <div className='headingText1'>
                    <h3>{title}</h3>
                    <div className='namedate'>
                      <p>{author}</p>
                      <span className='dot'></span>
                      <p>{moment(publishedAt).format('YYYY-MM-DD hh:mm a')}</p>

                    </div>
                    <div className='newsContentDiv'>
                      <p className='newsContent'>{content}</p>
                    </div>
                  </div>
                  <div className='imgDiv'>
                    <img src={urlToImage} alt="NewsImage" className='LogoImg' />
                  </div>
                </div>
              )
            }) : null
            }


          </div> :
          <div className='mainContainer'>
            {articles_list.length > 0 ? articles_list.map(({ author, content, description, publishedAt, source, title, url, urlToImage }) => {
              return (
                <div className='subContainer'>
                  <div className='headingText1'>
                    <h3>{title}</h3>
                    <div className='namedate'>
                      <p>{author}</p>
                      <span className='dot'></span>
                      <p>{moment(publishedAt).format('YYYY-MM-DD hh:mm a')}</p>

                    </div>
                    <div className='newsContentDiv'>
                      <p className='newsContent'>{content}</p>
                    </div>
                  </div>
                  <div className='imgDiv'>
                    <img src={urlToImage} alt="NewsImage" className='LogoImg' />
                  </div>
                </div>
              )
            }) : null}


          </div>
      }


    </div>
  );
}

export default App;
