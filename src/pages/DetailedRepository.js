
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import axios from '../helper/axios';
import { toast } from 'react-toastify';

const DetailedRepository = () => {
  const param = useParams()
  const [currentRepo, setCurrentRepo] = useState({})

  useEffect(() => {
    lookupCurrentRepo()
  }, []);

  const lookupCurrentRepo = () => {
    axios.get('/search/repositories', {
      params: {
        q: 'repo:'+param['owner'] +'/' + param['repoName']
      }
    })
    .then(function (response) {
      let items = response?.data?.items
      if(items && items.length > 0) {
        setCurrentRepo(response.data.items[0])
      } else {
        setCurrentRepo({})
      }
    })
    .catch(function (error) {
      toast.error(error.message, { position: toast.POSITION.TOP_RIGHT })
    });
  }

  return (
    <div className="detailed-repository-container">
      <div className="detailed-repository-wrapper">
        <h2>
          {currentRepo?.owner?.login}/{currentRepo?.name}
        </h2>
        <div>
          {currentRepo?.description}
        </div>
        <br />
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex">
            <b className="me-2">Language:</b> {currentRepo?.language}
          </div>
          <div className="d-flex">
            <img className="me-2" src="https://img.icons8.com/ios-glyphs/30/000000/star--v1.png"/>
            <div className="d-flex justify-content-center align-items-center">
              {currentRepo?.stargazers_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailedRepository