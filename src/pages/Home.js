import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';   
import Dropdown from 'react-dropdown';
import jsyaml from 'js-yaml' 
import axios from '../helper/axios';

const Home = () => {
  const [githubSearchVal, setGithubSearchVal] = useState('')
  const [languageSearchVal, setLanguageSearchVal] = useState('')
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('')
  const [languageOptions, setLanguageOptions] = useState([])
  const sortOptions = [
    { value: '', label: 'Best Match' },
    { value: 'stars', label: 'Stars', }
  ];
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0].value)
  const [githubSearchResults, setGithubSearchResults] = useState([])

  useEffect(() => {
    getLanguageList()
  }, []);

  useEffect(() => {
    // Update query if either the sort or language value are updated
    if(githubSearchVal !== '') {
      submitGithubQuery()
    }
  }, [selectedSortOption, selectedLanguageFilter]);

  const submitGithubQuery = () => {
    // If the searchbox is empty reset the results
    if(githubSearchVal === '') {
      setGithubSearchResults([])
    } else {
      let languageText = selectedLanguageFilter !== '' ? ' language='+selectedLanguageFilter : '' 
      axios.get('/search/repositories', {
        params: {
          q: githubSearchVal + languageText,
          sort: selectedSortOption.value
        }
      })
      .then(function (response) {
        setGithubSearchResults(response?.data?.items ?? [])
      })
      .catch(function (error) {
        toast.error(error.message, { position: toast.POSITION.TOP_RIGHT })
      });
    }
    
  }
  const submitLanguageQuery = () => {
    // If the searchbox is empty reset the filter
    if(languageSearchVal === '') {
      setSelectedLanguageFilter('')
    } else {
      // Looks in list of languages to see if search matches
      let languageFound = false
      for(let i = 0; i < languageOptions.length; i++) {
        if(languageOptions[i].toLowerCase() === languageSearchVal.toLowerCase()) {
          setSelectedLanguageFilter(languageSearchVal)
          languageFound = true
        }
      }
      if(languageFound !== true) {
        toast.error(`'${languageSearchVal}' did not match any languages on Github.`, { position: toast.POSITION.TOP_RIGHT })
        setLanguageSearchVal('')
      }
    }
  }

  const getLanguageList = () => {
    axios.get('https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml')
    .then(function (res) {
      let yamlRes = jsyaml.load(res.data);
      let languageOptionsList = Object.keys(yamlRes)
      setLanguageOptions(languageOptionsList)
    })
    .catch(function (error) {
      toast.error(error.message, { position: toast.POSITION.TOP_RIGHT })
    });
  }

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-center align-items-center m-2 flex-wrap">
        Github Search:
        <input className="mx-2" value={ githubSearchVal } onChange={ (e) => setGithubSearchVal(e.target.value) }/>
        <button className='btn btn-primary' onClick={ submitGithubQuery }>Submit</button>
      </div>
      <div className="d-flex justify-content-center align-items-center m-2 flex-wrap">
        <div className="d-flex align-items-center">
          Sort:
          <Dropdown className="github-sort mx-2" options={sortOptions} onChange={(e) => setSelectedSortOption(e)} value={selectedSortOption} placeholder="Select an option" />
        </div>
        <div className="d-flex align-items-center flex-wrap">
          Language Filter:
          <input placeholder="Filter by language..." className="autocomplete-input mx-2" value={languageSearchVal} onChange={(e) => setLanguageSearchVal(e.target.value)} />
          <button className="btn btn-primary m-2" onClick={(e) => submitLanguageQuery()}>Apply</button>
        </div>
      </div>
      
      <div>
        {
          githubSearchResults.map((result, index) => (
            <div key={result.name + index} className='border-bottom p-3'>
              <div><a href={`/${result.owner.login}/${result.name}`} >{result.name}</a></div>
              <div>{result.description}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home